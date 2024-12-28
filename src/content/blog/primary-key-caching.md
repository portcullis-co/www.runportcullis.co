---
title: "How to Cache Primary Keys on Clickhouse"
description: "Clickhouse 24.12 is fresh out of the oven with some really cool new features that enable even more efficient queries and cluster performance."
pubDate: "Dec 28 2024"
cover: "/blog/primary-key-cache.png"
category: "insights"
---

Clickhouse 24.12 is fresh out of the oven with some really cool new features that enable even more efficient queries and cluster performance. Clickhouse in general already is a very fast OLAP data warehouse, but with this release, one of the standout additions is a new cache for primary indexes, which can dramatically improve query performance by reducing disk reads and network traffic in distributed setups. 

This feature is particularly valuable for tables with frequent point lookups or joins on primary key columns. Let's explore how to implement and optimize primary key caching in Clickhouse to boost your query efficiency.

## Use Cases

Primary key caching in Clickhouse is particularly beneficial in several common scenarios:

1. High-frequency point queries where you repeatedly look up specific rows by their primary key
2. Join operations between large tables where one table is frequently accessed by its primary key
3. Distributed setups where reducing network traffic between nodes is crucial for performance

These use cases are especially relevant for applications that maintain hot paths in their query patterns, such as real-time analytics dashboards or operational monitoring systems.

To better understand when primary key caching makes sense, let's look at a practical example. Imagine you have a large table of user events where you frequently need to look up specific user sessions by their ID. Without caching, each lookup requires reading from disk and potentially network transfers in a distributed setup. With primary key caching enabled, these lookups become significantly faster as the index data stays in memory.

## Enabling Primary Index Caching

To enable primary key caching in Clickhouse 24.12, you'll need to configure a few settings at both the server and query level. The configuration is straightforward but requires careful consideration of your memory resources and query patterns. Let's walk through the essential steps to enable and optimize this feature.

### Toggle the `use_primary_index_cache` Setting

First, enable primary key caching at the server level by modifying your Clickhouse configuration. Add the following setting to your config.xml file:

```xml
<use_primary_index_cache>1</use_primary_index_cache>
```

You can also enable it for specific queries using the runtime setting:

```sql
SET use_primary_index_cache = 1;
```

This setting allows Clickhouse to maintain a cache of frequently accessed primary key index entries, significantly reducing disk I/O for subsequent queries.

### Prewarming the primary index

To maximize the benefits of primary key caching, you can prewarm the cache before running your queries. This ensures that frequently accessed index entries are already loaded into memory when you need them. Enable prewarming by setting:

```sql
SET prewarm_primary_key_cache = 1;
```

This setting is particularly useful after server restarts or when you know you'll be running a batch of queries that will benefit from cached primary key indexes.

## Conclusion

Primary key caching in Clickhouse 24.12 represents a significant advancement in query optimization, particularly for workloads involving frequent lookups and distributed operations. By properly configuring and utilizing this feature, you can achieve substantial performance improvements in your Clickhouse deployments. Remember to monitor your cache usage and adjust settings based on your specific workload patterns to get the most benefit from this powerful feature.