---
title: "The 2025 Clickhouse Roadmap: An Overview"
description: "From performance optimizations to new features that will make this real-time warehouse even more powerful, 2025 is shaping up to be a transformative year for the platform. Let's dive into some of the key areas we'll be focusing on."
pubDate: "Jan 2 2025"
cover: "/blog/blog-cover-2025.png"
category: "insights"
---

It’s a brand new year and that means plans and being made for product direction and strategy for the next 364 days. With 2024 being the birth of Portcullis as a company, it’s hard to look at 2025 with anything but wide-eyed excitement for what challenges and growth opportunities present themselves this year. 

Something we’re really excited for is all of the fast-pased developments happening in the overall ecosystem. From performance optimizations to new features that will make this real-time warehouse even more powerful, 2025 is shaping up to be a transformative year for Clickhouse. Let's dive into some of the key areas we'll be focusing on.

## The year of dancing data  🕺

If there is anything we want to highlight on the 2025 roadmap, it’s that data is about to get a lot easier to move into and out of Clickhouse with tons of new interfaces and API features being added. 

### Remote and Cloud database engines

One super exciting feature coming to Clickhouse in 2025 is expanded support for remote and cloud database engines. This will enable users to attach a database from a remote Clickhouse server, making it easier than ever to build distributed data architectures. 

The new engines will support both read and write operations, with optimized performance for large-scale data transfers.

### Drivers for UDFs

In [Issue #71172](https://github.com/ClickHouse/ClickHouse/issues/71172) on the roadmap, it’s planned to allow users to write code of configuration for a UDF in any arbitrary languagedirectly in the `CREATE FUNCTION` statement. 

This feature would broaden the flexibility of Clickhouse UDF and make the developer experience more enjoyable.  

### Tabular Insert handler

The [tabular Insert hander](https://github.com/ClickHouse/ClickHouse/pull/64336) seeks to add another exciting addition that will streamline data ingestion. This feature will allow users to insert data by simply passing queries like `tabular/database/table.csv`, which are which are equal to the SQL query `SELECT * FROM database.table FORMAT CSV`. 

Additional parameters can be specified in the path, such as `select`, `columns`, `where`, `order`, which are combined with the query. For example `tabular/table?columns=a,b&where=a>1&order=a ASC, b DESC` is equal to `SELECT a,b FROM table WHERE a > 1 ORDER BY a ASC, b DESC`.

### Implicit Inserts

[Issue #38775](https://github.com/ClickHouse/ClickHouse/issues/38775) seeks to enable event simpler data upload via implicit inserts for HTTP PUT request and POST with form file upload where the query is not specified. It makes the assumption that it is an INSERT query into a table with the name as the corresponding file name, with format autodetected from the file name.

### HTTP Event Stream

Another exciting feature planned for 2025 is HTTP Event Stream support, which will allow for real-time data streaming directly into and from Clickhouse via HTTP. This feature will enable applications to maintain an open connection and receive updates as new data becomes available, making it perfect for building real-time dashboards and monitoring systems. 

## A roadmap for storage success 🗺️

The next category of features we’re excited to see this year is new and more efficient methods of storage and optimizations on storage methods currently provided.   

### JSON data type from beta to production

One of the most anticipated storage features for 2025 is the promotion of the JSON data type from beta to production status. This native JSON support will enable more efficient storage and querying of JSON data, with improved performance and reduced complexity compared to current workarounds. The feature will include optimized indexing strategies and enhanced JSON-specific functions, making it easier for developers to work with semi-structured data in Clickhouse.

### ShardedMap data type

The ShardedMap data type is another exciting addition coming to Clickhouse. This new data structure will allow for efficient storage and querying of key-value pairs across distributed environments. It's particularly useful for applications requiring fast lookups across large datasets while maintaining data locality within shards.

### Time data type

The Time data type is a new addition planned for 2025 that will provide native support for time-only values without dates. This will be particularly useful for applications that need to work with recurring schedules, time-series data, or daily patterns. The implementation will include optimized storage and comparison operations, making time-based queries more efficient.

### Production-ready vector search

Vector search capabilities are moving from experimental to production-ready, bringing robust support for similarity search across high-dimensional vectors. This feature will enable advanced machine learning applications, semantic search, and recommendation systems directly within Clickhouse. The implementation includes optimized index structures and distance calculation methods, making it possible to perform efficient nearest neighbor searches across massive vector datasets.

### Transactions for Replicated tables

A significant enhancement planned for replicated tables is the introduction of transactions which will ensure atomic operations across distributed environments. This will make it easier to maintain data consistency in complex write scenarios. The implementation will include support for both single-table and multi-table transactions, with configurable isolation levels to balance consistency requirements with performance needs.

### Unique key constraint

Another significant enhancement planned for Clickhouse’s roadmap is the introduction of unique key constraints for tables. This feature will allow developers to enforce data uniqueness at the database level, preventing duplicate entries and maintaining data integrity. The implementation will include support for both single-column and composite unique keys, with optimized performance for constraint checking during insert and update operations.

## New year, new query engines 🏎️

There’s a bunch of planned optimizations planned in 2025 such as new query engines, ans optimizations to existing ones which will make complex analytical queries faster and more efficient than ever. These improvements focus on both performance and functionality, giving developers more tools to build sophisticated data applications.

### Materialized CTE

Materialized Common Table Expressions (CTEs) are coming to Clickhouse, bringing significant performance improvements for complex queries. This feature will allow intermediate results to be stored and reused across multiple parts of a query, reducing redundant computations. The implementation includes intelligent materialization decisions based on query cost estimates, ensuring optimal performance for queries with repeated CTE references.

### On-disk query cache

The on-disk query cache is another performance-focused feature coming to Clickhouse in 2025. This enhancement will allow frequently executed queries to store their results on disk, significantly reducing computation overhead for repeated queries. The implementation includes intelligent cache invalidation strategies and configurable cache sizes to optimize storage usage while maintaining query performance.

### Streaming queries

Streaming queries are getting a major upgrade in 2025, with improvements to how Clickhouse handles continuous data processing. This enhancement will allow for more efficient processing of real-time data streams, with better memory management and reduced latency. The feature will include support for windowing operations and stateful processing, making it easier to build real-time analytics applications.

### PREWHERE to work with the FINAL clause

[Issue #70210](https://github.com/ClickHouse/ClickHouse/pull/70210) adds the ability for PREWHERE to work with the FINAL clause. This enhancement will improve query performance by allowing the PREWHERE optimization to be applied even when using FINAL to get the latest versions of records. The implementation will include intelligent optimization strategies to ensure optimal execution plans for queries combining these clauses.

### JOIN reordering based on finer-grained statistics

JOIN reordering in Clickhouse is getting smarter with the introduction of finer-grained statistics collection and analysis. This enhancement will enable the query optimizer to make better decisions about join order based on detailed table statistics, column distributions, and historical query patterns. The result will be faster execution times for complex joins, especially in scenarios involving multiple tables with varying sizes and data distributions.

### Using a partition key to optimize JOINs

Another optimization coming to Clickhouse is the ability to use partition keys to optimize JOIN operations. This feature will allow the query engine to leverage partitioning information to reduce the amount of data that needs to be processed during joins, resulting in faster query execution. The implementation will include intelligent partition pruning strategies and improved data locality for distributed joins.

This optimization is particularly valuable for large-scale distributed deployments where data locality can significantly impact query performance.

## Looking ahead 🔮

These planned features and improvements for 2025 represent just a fraction of what's in store for Clickhouse. As the platform continues to evolve, we're excited to see how these enhancements will enable new use cases and improve existing workflows for developers and data teams alike.

If you’d like to discuss how Portcullis can help you prepare for some of these changes, or explore support in any of the massive feature-set that Clickhouse already has, let’s hop on a call soon.