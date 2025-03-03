---
title: "Building a vector-search powered recommendation engine for vintage products: Part 1"
description: "As the global zeitgeist begins to descend further and further into mindsets of throwing LLMs at every single thing and seeing what sticks, it becomes harder to differentiate craft and cruft."
pubDate: "Mar 3 2025"
cover: "/blog/blog-cover-recommendation-engine.png"
category: "insights"
---

As the global zeitgeist begins to descend further and further into mindsets of throwing LLMs at every single thing and seeing what sticks, it becomes harder to differentiate craft and cruft. Much like the early days of the dot-com era, there’s a million different “AI companies” who are dying to make a quick buck regardless of if their product actually provides value. 

The fact I don’t see much of this is what makes me really enjoy the Clickhouse ecosystem. For the most part, everyone has a very high drive for curiosity-driven development and solving problems using their own pattern recognition skills. In the Clickhouse #help channels, there’s always a air of natural curiosity and a desire to learn more about this beast of an OSS data warehouse. 

One of the Clickhouse features we’ve had a lot of clients asking questions about recently, and seen a lot of question on the Slack channels about is Vector indexing and search, so in response we’ve decided to write a 2 part blog series about building a recommendation engine for a vintage goods and furniture shop with Clickhouse. 

## Understanding the problem

Before we get started, we’re going to explore the problem we’re building for a little bit. Our imaginary client, Nostalgia Bin, is an online shop that specializes in curated vintage items and lost media from a wide range of generations. They've amassed a catalog of over 10,000 unique items, ranging from lost VHS tapes, Danish modern chairs to Italian glass lamps. Their challenge is connecting customers with items they'll love based on aesthetic preferences rather than just traditional category browsing.

The company has tried traditional text search and category filtering, but these approaches fail to capture the emotional and aesthetic connections that drive vintage purchases. That's where vector search comes in - by translating visual and descriptive elements into mathematical representations, we can build a system that truly understands the "vibe" a customer is looking for. We’re going to explore how we can leverage Clickhouse's vector capabilities to solve this unique recommendation challenge.

## Generating the data

For this blog post, we need a realistic dataset that mirrors the diverse inventory of our fictional vintage shop. Rather than using a pre-existing dataset, we'll generate one that specifically captures the nuances of vintage products - their aesthetics, origins, materials, and the emotional responses they evoke.

We'll create approximately 10,000 product entries with detailed attributes including product name, category, era (decade of origin), materials, colors, condition rating, price point, and most importantly, a rich description that captures the unique character of each item. This descriptive text will serve as the foundation for our vector embeddings.

### Create the schema

First, let’s create our schema on Clickhouse with this structure:

```sql
CREATE TABLE nostalgia_bin (
    product_id UInt32,
    name String,
    category String,
    subcategory String,
    era String,
    decade UInt16,
    materials Array(String),
    colors Array(String),
    condition_rating Float32,
    price_dollars Float32,
    description String,
    embedding Array(Float32),
    date_added DateTime
) ENGINE = MergeTree()
ORDER BY product_id;
```

### Clone the utility files

Next, we’re going to need to clone the repo that contains the files for generating and inserting our demonstration data:

```sql
gh repo clone portcullis-co/nostalgia-bin
```

This repo contains two important files, so lets take a look at them:

- **Generator.py - Creates a JSON file containing 10,000 product entries of various vintage items**
- **Loader.py - Uses the JSON file from the generatos to create and load embeddings of the product entries into the `nostalgia_bin.embeddings` column**

### Generate the product entries

Now that you’ve cloned the utility files, the first thing to do is execute the generator file. 

```bash
python ./generator.py
```

A successful execution should look something like this:

```sql
nostalgia-bin % python ./generator.py
Generating products: 100%|███████████████████████| 10000/10000 [00:01<00:00, 9167.55it/s]
Generated 10000 vintage products and saved to nostalgia_bin_products.json

Sample Product:
product_id: 2237
name: 1900s Figurine
category: Home Decor
subcategory: Figurines
era: Victorian
decade: 1900
materials: ['Bronze']
colors: ['Orange', 'Navy']
condition_rating: 5.0
price_dollars: 2280.0
description: This piece captures the zeitgeist of Belle Époque. Evokes a sense of nostalgia. Mint condition. Appears almost new despite its age. Museum quality piece. A pristine piece from the 1900s. Made with high-quality Bronze. The Orange and Navy colors evoke the 1900s aesthetic.
date_added: 2022-06-19 16:45:47
```

This will result in a JSON file named `nostalgia_bin_products.json`, which will be opened into the loader here:

```python
with open('nostalgia_bin_products.json', 'r') as f:    
products = json.load(f)
```

### Generate and load embeddings

Now we’re ready to generate our embeddings and load them into Clickhouse, but before we do we need to set our required environment variables:

- `CLICKHOUSE_HOST`
- `CLICKHOUSE_USERNAME`
- `CLICKHOUSE_PASSWORD`
- `OPENAI_API_KEY`

We’ve made this simple for you by adding an `.env.example`  file with placeholders for you to add your own credentials. Once you’ve added your credentials, run the loader and go grab some lunch because it can take awhile to finish:

```bash
python ./loader.py
```

The output should show progress, and when you’re finished, you can go into your Clickhouse instance and run this to see the embeddings:

```sql
SELECT embedding from nostalgia_bin
```

If you see something like this, then you’ve completed Part 1 of this series!

![chat.svg](/blog/embeddings.png)

## Up Next

In the next part, we’re going to dive into how to use these embeddings to power vector similarity search in Clickhouse to create a recommendation engine for Nostalgia Bin. 

We'll learn how to effectively query this data using vector similarity, explain the concept behind cosine similarity searches, and implement a recommendation engine that surfaces items based on aesthetics rather than just keywords. Along the way, we'll discuss how to architect the system to handle real-time recommendations while maintaining performance at scale.