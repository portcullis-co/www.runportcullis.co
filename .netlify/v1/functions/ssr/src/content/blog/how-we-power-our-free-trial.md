---
title: "How we power the smooth operation of a services-based free trial with Slack Connect"
description: "We just launched our free trial for Portcullis's on-demand Clickhouse support offering, and it's been a game changer. We've been able to get a lot of value out of it, and we're excited to share how we've been using it to power our free trial."
pubDate: "Jan 23 2025"
cover: "/blog/blog-cover-slack.png"
category: "insights"
---

Having the best processes in place can make all the difference when it comes to delivering an exceptional customer experience. This is even more true for services based companies where managing the onboarding process effectively is crucial to demonstrate value quickly. At Portcullis, we've developed a streamlined approach using Slack Connect that ensures our trial users get the support they need while keeping our team coordinated and responsive.

In this post we’re going to be guiding you through our trial on-boarding journey and dive into how we leverage the Slack and Hubspot APIs to create a collaborative environment that sets both our customers and our team up for success. We'll explore the specific workflows we've built and share some key learnings from implementing this approach. But first, let's address an important question about our process.

## Why we didn’t use scheduling links

A common question many people have asked is why we didn’t just use the traditional approach of scheduling link providers such as [Cal.com](http://Cal.com) or Calendly. In fact, we were doing this originally but a few key issues made it difficult to manage with two founders on totally opposing time-zones, me being EST and Pablo being AEST. 

Often, when people would schedule links with us, even when using the Collective scheduler it would require one of us to be awake at an insane time if both people we’re required to chat. This created a disjointed front when talking to customers as one of us would be half awake and the other would be fully awake. So we decided we needed something that would be able to onboard customers while still maintaining asynchronous and synchronous communication, like Slack does. 

### How did Slack Connect solve this?

Slack Connect is a really neat platform that I’m sad nobody else has managed to break Salesforce’s monopoly on, but it has so far solved our problem perfectly by allowing our leads and customers to 

communicate with us in a way that works for their schedule and ours. By having an always-on channel of communication, customers can drop questions or schedule demos when it makes sense for them, and we can respond during our respective working hours. This approach has dramatically improved our ability to provide consistent, high-quality support while maintaining work-life balance across time zones.

## How do we do it?

The Slack API is…less that adequate in terms of documentation but with the help of Claude and Cursor, we we’re able to build a super flexible pure-fetch API route on our Astro homepage that handles not only the creation of a Slack channel and hitting the **`conversations.inviteShared`** API method, but also creating the lead in Hubspot so they are ready to be tracked over the course of their lifetime. 

Here’s a [gist](https://gist.github.com/jdbohrman/065477d6644fe70dd9613f2935bb21ce) of the `/invite` endpoint. Essentially, all it does is these steps:

1. Checks for the required environment variables for the Slack and Hubspot APIs

```typescript
    const slackToken = import.meta.env.SLACK_BOT_TOKEN;
    const hubspotToken = import.meta.env.HUBSPOT_ACCESS_TOKEN;

    if (!slackToken || !hubspotToken) {
        console.error('Environment variables not found', {
            hasSlackToken: !!slackToken,
            hasHubspotToken: !!hubspotToken
        });
        return new Response(JSON.stringify({ error: 'Configuration error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
```

2. Grabs the form data from the incoming request

```typescript
            const contentType = request.headers.get('content-type');
        let email, firstName, lastName, companyName, jobTitle;

        // Debug token (only showing first/last 4 chars)
        const tokenPreview = hubspotToken ? `${hubspotToken.slice(0,4)}...${hubspotToken.slice(-4)}` : 'undefined';
        console.log('HubSpot Token Preview:', tokenPreview);

        if (contentType?.includes('application/x-www-form-urlencoded')) {
            const formData = await request.formData();
            const text = formData.get('text') as string;

            if (!text || text.trim() === '') {
                return new Response(JSON.stringify({
                    response_type: 'ephemeral',
                    text: "How to use `/invite`:\n```/invite email firstName lastName companyName jobTitle```\nExample:\n```/invite jane@acme.com Jane Smith Acme CTO```"
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            [email, firstName, lastName, companyName, jobTitle] = text.split(' ');
            console.log('Parsed Slack command:', { email, firstName, lastName, companyName, jobTitle });
        } else {
            const data = await request.json();
            ({ email, firstName, lastName, companyName, jobTitle } = data);
        }
```

3. Splits the `domain` from the email and sanitizes the domain

```typescript
    const domain = email.split('@')[1];
    const sanitizedCompanyName = companyName.trim();
```

4. Makes a request to the `https://api.hubapi.com/crm/v3/objects/companies` API in the `companyResponse`

```typescript
        const companyResponse = await fetch('https://api.hubapi.com/crm/v3/objects/companies', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    name: sanitizedCompanyName,
                    domain: domain,
                    hubspot_owner_id: '1546319970'
                }
            })
        });

        if (!companyResponse.ok) {
            const error = await companyResponse.text();
            console.error('HubSpot Company Creation Failed:', error);
            throw new Error(`HubSpot Company Creation Failed: ${error}`);
        }
```

5. Makes a request to the `https://api.hubapi.com/crm/v3/objects/contact` API in the `contactResponse`

```typescript
            const companyData = await companyResponse.json();
        const companyId = companyData.id;
        console.log('Company created:', companyId);

        // Create contact with error checking
        const contactResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json',
                'accept': 'application/json'
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

        if (!contactResponse.ok) {
            const error = await contactResponse.text();
            console.error('HubSpot Contact Creation Failed:', error);
            throw new Error(`HubSpot Contact Creation Failed: ${error}`);
        }
```

6. Uses the sanitized `companyName` to create a `const` for the `channelName`

```typescript
    const channelName = `connect-${sanitizedCompanyName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
    console.log('Creating Slack channel:', channelName);
```

7. Creates a channel using the `channelName` by making a request to `conversations.create`

```typescript
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
        if (!channelData.ok) {
            console.error('Slack Channel Creation Failed:', channelData.error);
            throw new Error(`Slack Channel Creation Failed: ${channelData.error}`);
        }
```

8. Grabs the `channelId` from the `channelResponse`

```typescript
    const channelId = channelData.channel?.id;
    console.log('Channel created:', channelId);
```

9. Invites the member to a Slack Connect channel via the `conversations.invite` and `conversations.inviteShared` methods

```typescript
    const inviteResponse = await fetch('https://slack.com/api/conversations.invite', {
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

    const inviteData = await inviteResponse.json();
    if (!inviteData.ok) {
        console.error('Slack Invite Failed:', inviteData.error);
        throw new Error(`Slack Invite Failed: ${inviteData.error}`);
    }

            const inviteData = await inviteResponse.json();
        if (!inviteData.ok) {
            console.error('Slack Invite Failed:', inviteData.error);
            throw new Error(`Slack Invite Failed: ${inviteData.error}`);
        }

        // Send Slack Connect invite with error checking
        const connectInviteResponse = await fetch('https://slack.com/api/conversations.inviteShared', {
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
```

10. Saves the invite data in `connectInviteData`

```typescript

    const connectInviteData = await connectInviteResponse.json();
    if (!connectInviteData.ok) {
        console.error('Slack Connect Invite Failed:', connectInviteData.error);
        throw new Error(`Slack Connect Invite Failed: ${connectInviteData.error}`);
    }
```

## Issues we ran into

The main issue we ran into that made this difficult but we easily overcome was running this on Cloudflare Workers which didn’t seem to play well with Astro and the environment variables. So we ended up just switching to Netflify and everything ended up being fine. Other caveats you may need to watch out for are:

- Rate limiting on the Slack API - make sure to implement proper backoff handling
- Channel naming conventions - Slack has strict rules about allowed characters and length
- Handling edge cases when companies or contacts already exist in HubSpot

These issues are relatively minor and can be handled with proper error checking and fallback logic in your implementation.

## The Results

We’re still in the process of measuring things, but so far, our Slack Connect-based trial process has proven to be a game-changer for our customer on-boarding experience. By combining the power of Slack's API with HubSpot integration, we've created a system that not only accommodates our spread out team but also provides a more flexible and responsive experience for our trial users. 

It also makes troubleshooting issues while providing the type of support that customers have come to love from SLA-backed services like AWS Business Tier a much smoother experience. If that’s the type of experience you’re looking for for your Clickhouse operations, I think it’s time you open a Slack Connect channel and start a 1-week trial with me and Pablo.

Head over to the [pricing page](https://www.runportcullis.co/pricing) to start today!