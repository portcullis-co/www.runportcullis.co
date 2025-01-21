export const config = {
  runtime: 'edge',
};

export async function POST({ request }: { request: Request }) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const slackToken = import.meta.env.SLACK_BOT_TOKEN;
    const hubspotToken = import.meta.env.HUBSPOT_ACCESS_TOKEN;

    try {
        const { email, firstName, lastName, companyName, jobTitle } = await request.json();
        const domain = email.split('@')[1];
        const sanitizedCompanyName = companyName.trim();

        // Create company
        const companyResponse = await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    name: sanitizedCompanyName,
                    domain: domain,
                    hubspot_owner_id: '1546319970'
                }
            })
        });
        const companyData = await companyResponse.json();
        const companyId = companyData.id;

        // Create contact
        const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    email,
                    firstname: firstName,
                    lastname: lastName,
                    jobtitle: jobTitle,
                    company: sanitizedCompanyName,
                    lifecyclestage: 'opportunity',
                    hs_lead_status: 'IN_PROGRESS',
                    hubspot_owner_id: '1546319970'
                }
            })
        });
        const contactData = await contactResponse.json();
        const contactId = contactData.id;

        // Create association
        if (contactId && companyId) {
            await fetch(`https://api.hubapi.com/crm/v4/associations/contacts/${contactId}/companies/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${hubspotToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    types: [{
                        associationCategory: 'HUBSPOT_DEFINED',
                        associationTypeId: 1
                    }]
                })
            });
        }

        // Create Slack channel
        const channelName = `connect-${sanitizedCompanyName.toLowerCase()}`;
        const createChannelResponse = await fetch('https://slack.com/api/conversations.create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${slackToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: channelName,
                is_private: true
            })
        });
        const channelData = await createChannelResponse.json();
        const channelId = channelData.channel?.id;

        // Invite team members
        await fetch('https://slack.com/api/conversations.invite', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${slackToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: channelId,
                users: 'U07TUHW4NPL,U07TX3KJG84'
            })
        });

        // Send Slack Connect invite
        await fetch('https://slack.com/api/conversations.inviteShared', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${slackToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: channelId,
                emails: [email]
            })
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}