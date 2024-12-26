---
title: "Clickhouse Use Case Guide: Digital Twins"
description: "As the world becomes more tech-driven, we rely more and more on rare earth metals to power our phones, appliances, and even lifesaving devices. The mining operations to gather these minerals have grown increasingly complex and sophisticated."
pubDate: "Dec 25 2024"
cover: "/blog/blog-cover-http-headers.png"
category: "insights"
---

The Clickhouse team and ecosystem is constantly pushing the envelope on new features and improving existing tools. If you didn’t catch it, the [Clickhouse v24.12 Release Call](https://www.youtube.com/watch?v=bv-ut-Q6vnc&t=4s) had some really exciting new announcements that I’m excited to highlight today.  One interesting addition that may not seem like a huge “wow” feature, but is incredibly necessary for remote operations is the ability to set custom HTTP headers in SELECT statements. 

This opens up new possibilities for authentication and authorization when querying external data sources as well as handling the content-type. 

## What was missing?

Before the introduction of custom HTTP headers in SELECT statements, working with external HTTP sources had some limitations. When querying external HTTP endpoints, you were restricted to basic authentication methods and default headers. This made it challenging to work with APIs that required specific authentication tokens, custom content types, or other specialized headers.

Additionally, there was no standardized way to handle different authentication schemes across various data sources, which could lead to implementation inconsistencies. Organizations often had to resort to workarounds or additional middleware to handle these requirements properly.

### Example: Basic HTTP Request Before Custom Headers

Let's look at a simple example of how we would previously query an HTTP endpoint in Clickhouse:

```sql
SELECT * FROM url('https://api.example.com/data', JSONEachRow)
```

This basic approach worked for simple cases but fell short when dealing with modern APIs that require authentication tokens or specific content-type headers.

## What has changed?

Now, Clickhouse users can add custom HTTP headers inline with their SELECT statements. This enhancement allows for better integration with secured APIs and services by supporting custom authentication headers, content-type specifications, and other HTTP header requirements. Let's look at how this works in practice.

```sql
CREATE OR REPLACE VIEW pictures AS SELECT `...` AS img;
CREATE USER viewer SETTINGS http_response_headers = $${'Content-Type': 'image/svg+xml'}$$;
GRATE SELECT ON pictures TO user
```

The example above demonstrates how to set custom HTTP headers when creating a view and granting access to users. This allows for proper content-type specification when serving images or other media files. Let's explore a more common use case involving API authentication.

```sql
SELECT *
FROM url('https://api.example.com/data', JSONEachRow, 
    HEADERS('Authorization: Bearer your-token-here',
            'Content-Type: application/json'));
```

In this example, we're adding both an authentication token and specifying the content type, which is essential when working with modern REST APIs.

## Core Use Cases

Let's explore some of the key use cases where custom HTTP headers in SELECT statements prove particularly valuable:

- API Authentication - Seamlessly integrate with secured APIs by passing authentication tokens or API keys via headers
- Content Type Negotiation - Specify the expected response format when dealing with endpoints that serve multiple content types
- Custom Metadata - Pass additional context or tracking information through custom headers for better request management

These custom headers provide a flexible way to handle various integration scenarios while maintaining security and data integrity. The ability to set headers directly in SELECT statements streamlines the development process and reduces the complexity of external data source interactions.

## Conclusion

The addition of custom HTTP headers in SELECT statements represents a significant enhancement to Clickhouse's functionality, particularly for organizations working with external APIs and data sources. This feature simplifies integration workflows and provides greater flexibility in how we interact with external services. As Clickhouse continues to evolve, improvements like these demonstrate their commitment to making data operations more seamless and secure.