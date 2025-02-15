import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { WebClient } from '@slack/web-api';
import { Client } from '@hubspot/api-client';
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4/models/AssociationSpec';

// Initialize Stripe
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
});

// Initialize Slack client
const slack = new WebClient(import.meta.env.SLACK_BOT_TOKEN);

// Initialize HubSpot client
const hubspot = new Client({ accessToken: import.meta.env.HUBSPOT_ACCESS_TOKEN });
const apolloOrgEnrichUrl = 'https://api.apollo.io/api/v1/organizations/enrich';
const apolloOrgEnrichOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.APOLLO_API_KEY
  }
};

async function enrichCompany(domain: string) {
  const response = await fetch(`${apolloOrgEnrichUrl}?domain=${domain}`, apolloOrgEnrichOptions);
  if (!response.ok) {
    throw new Error(`Apollo API error: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data?.organization) {
    throw new Error('No organization data found');
  }
  return data;
}

async function createHubspotRecords(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;

  if (!email) {
    throw new Error('Missing company name or email');
  }

  const domain = email.split('@')[1];
  const enrichedCompany = await enrichCompany(domain);
  const companyName = enrichedCompany.organization.name;
  const companyDescription = enrichedCompany.organization.description;
  const linkedinUrl = enrichedCompany.organization.linkedin_url;
  const industry = enrichedCompany.organization.industry;
  const numberOfEmployees = enrichedCompany.organization.estimated_num_employees;
  const annualRevenue = enrichedCompany.organization.annual_revenue;
  const logoUrl = enrichedCompany.organization.logo_url;
  // Create/update company in HubSpot
  const companyResponse = await hubspot.crm.companies.basicApi.create({
    properties: {
      name: companyName,
      domain: domain,
      description: companyDescription,
      linkedin_url: linkedinUrl,
      industry: industry,
      num_employees: numberOfEmployees,
      annual_revenue: annualRevenue,
      logo_url: logoUrl,
    }
  });

  const apolloPersonEnrichUrl = `https://api.apollo.io/api/v1/people/match?email=${email}&domain=${domain}&reveal_personal_emails=false&reveal_phone_number=false`;
  const apolloPersonEnrichOptions = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.APOLLO_API_KEY
    }
  };
  const apolloPersonEnrichResponse = await fetch(apolloPersonEnrichUrl, apolloPersonEnrichOptions);
  const apolloPersonEnrichData = await apolloPersonEnrichResponse.json();
  const apolloPerson = apolloPersonEnrichData.people[0];
  const firstName = apolloPerson.first_name;
  const lastName = apolloPerson.last_name;
  

  // Create/update contact in HubSpot
  const contactResponse = await hubspot.crm.contacts.basicApi.create({
    properties: {
      email: email,
      firstname: firstName,
      lastname: lastName,
      lead_status: 'new',
    }
  });

  const hubspotDefined = AssociationSpecAssociationCategoryEnum.HubspotDefined;
  const userDefined = AssociationSpecAssociationCategoryEnum.UserDefined;
  // Associate contact with company using Basic API
  await hubspot.crm.associations.v4.basicApi.create(
    'contacts',
    contactResponse.id,
    'companies',
    companyResponse.id,
    [{
      associationCategory: userDefined,
      associationTypeId: 2  // company to contact association type
    }]
  );

  // Create deal in Support Pipeline
  const dealResponse = await hubspot.crm.deals.basicApi.create({
    properties: {
      dealname: `${companyName} Trial`,
      pipeline: 'Support Pipeline',
      dealstage: 'Trial Started',
      amount: session.amount_total ? (session.amount_total / 100).toString() : '0',
      closedate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // 7 days from now
    }
  });

  // Associate deal with company using Basic API
  await hubspot.crm.associations.v4.basicApi.create(
    'deals',
    dealResponse.id,
    'companies',
    companyResponse.id,
    [{
      associationCategory: userDefined,
      associationTypeId: 6  // company to deal association type
    }]
  );

  return {
    companyId: companyResponse.id,
    contactId: contactResponse.id,
    dealId: dealResponse.id,
  };
}

async function updateDealStage(dealId: string, stage: string) {
  await hubspot.crm.deals.basicApi.update(dealId, {
    properties: {
      dealstage: stage,
    }
  });
}

async function createSlackChannel(channelName: string, retries = 3, delay = 1000) {
  try {
    const channelResponse = await slack.conversations.create({
      name: channelName,
      is_private: false,
    });

    if (!channelResponse.ok || !channelResponse.channel?.id) {
      throw new Error('Failed to create Slack channel');
    }

    return channelResponse.channel.id;
  } catch (error: any) {
    if (error.data?.error === 'ratelimited' && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return createSlackChannel(channelName, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function sendSlackInvite(channelId: string, email: string, retries = 3, delay = 1000) {
  try {
    const inviteResponse = await slack.conversations.inviteShared({
      channel: channelId,
      emails: [email],
      external_limited: false
    });

    if (!inviteResponse.ok) {
      throw new Error('Failed to send Slack Connect invitation');
    }

    return inviteResponse;
  } catch (error: any) {
    if (error.data?.error === 'ratelimited' && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendSlackInvite(channelId, email, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  try {
    // Verify Stripe webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      sig ?? '',
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_details?.email;
        if (!email) {
          throw new Error('Missing email');
        }

        const domain = email.split('@')[1];
        const companyData = await enrichCompany(domain);
        const channelName = `support-${companyData.organization.name.toLowerCase().replace(/\s+/g, '-')}`;
        const channelId = await createSlackChannel(channelName);
        await sendSlackInvite(channelId, email);

        // Create HubSpot records
        const hubspotRecords = await createHubspotRecords(session);

        // Store HubSpot IDs in Stripe metadata for future reference
        if (session.subscription) {
          await stripe.subscriptions.update(session.subscription as string, {
            metadata: {
              hubspot_company_id: hubspotRecords.companyId,
              hubspot_contact_id: hubspotRecords.contactId,
              hubspot_deal_id: hubspotRecords.dealId,
            }
          });
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        const dealId = subscription.metadata.hubspot_deal_id;
        
        if (dealId) {
          await updateDealStage(dealId, 'Trial Ending');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const dealId = subscription.metadata.hubspot_deal_id;
        
        if (!dealId) break;

        // If trial ended and subscription is active, move to Closed Won
        if (subscription.status === 'active' && subscription.trial_end && 
            subscription.trial_end < Math.floor(Date.now() / 1000)) {
          await updateDealStage(dealId, 'Closed Won');
        }
        // If subscription is canceled, move to Closed Lost
        else if (subscription.status === 'canceled') {
          await updateDealStage(dealId, 'Closed Lost');
        }
        break;
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 