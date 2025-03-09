import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, b as renderTemplate } from "./astro/server_aMtVhhw-.mjs";
import "clsx";
const html = `<p>As the global zeitgeist begins to descend further and further into mindsets of throwing LLMs at every single thing and seeing what sticks, it becomes harder to differentiate craft and cruft. Much like the early days of the dot-com era, there’s a million different “AI companies” who are dying to make a quick buck regardless of if their product actually provides value.</p>
<p>The fact I don’t see much of this is what makes me really enjoy the Clickhouse ecosystem. For the most part, everyone has a very high drive for curiosity-driven development and solving problems using their own pattern recognition skills. In the Clickhouse #help channels, there’s always a air of natural curiosity and a desire to learn more about this beast of an OSS data warehouse.</p>
<p>One of the Clickhouse features we’ve had a lot of clients asking questions about recently, and seen a lot of question on the Slack channels about is Vector indexing and search, so in response we’ve decided to write a 2 part blog series about building a recommendation engine for a vintage goods and furniture shop with Clickhouse.</p>
<h2 id="understanding-the-problem">Understanding the problem</h2>
<p>Before we get started, we’re going to explore the problem we’re building for a little bit. Our imaginary client, Nostalgia Bin, is an online shop that specializes in curated vintage items and lost media from a wide range of generations. They’ve amassed a catalog of over 10,000 unique items, ranging from lost VHS tapes, Danish modern chairs to Italian glass lamps. Their challenge is connecting customers with items they’ll love based on aesthetic preferences rather than just traditional category browsing.</p>
<p>The company has tried traditional text search and category filtering, but these approaches fail to capture the emotional and aesthetic connections that drive vintage purchases. That’s where vector search comes in - by translating visual and descriptive elements into mathematical representations, we can build a system that truly understands the “vibe” a customer is looking for. We’re going to explore how we can leverage Clickhouse’s vector capabilities to solve this unique recommendation challenge.</p>
<h2 id="generating-the-data">Generating the data</h2>
<p>For this blog post, we need a realistic dataset that mirrors the diverse inventory of our fictional vintage shop. Rather than using a pre-existing dataset, we’ll generate one that specifically captures the nuances of vintage products - their aesthetics, origins, materials, and the emotional responses they evoke.</p>
<p>We’ll create approximately 10,000 product entries with detailed attributes including product name, category, era (decade of origin), materials, colors, condition rating, price point, and most importantly, a rich description that captures the unique character of each item. This descriptive text will serve as the foundation for our vector embeddings.</p>
<h3 id="create-the-schema">Create the schema</h3>
<p>First, let’s create our schema on Clickhouse with this structure:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#F97583">CREATE</span><span style="color:#F97583"> TABLE</span><span style="color:#B392F0"> nostalgia_bin</span><span style="color:#E1E4E8"> (</span></span>
<span class="line"><span style="color:#E1E4E8">    product_id UInt32,</span></span>
<span class="line"><span style="color:#F97583">    name</span><span style="color:#E1E4E8"> String,</span></span>
<span class="line"><span style="color:#E1E4E8">    category String,</span></span>
<span class="line"><span style="color:#E1E4E8">    subcategory String,</span></span>
<span class="line"><span style="color:#E1E4E8">    era String,</span></span>
<span class="line"><span style="color:#E1E4E8">    decade UInt16,</span></span>
<span class="line"><span style="color:#E1E4E8">    materials </span><span style="color:#F97583">Array</span><span style="color:#E1E4E8">(String),</span></span>
<span class="line"><span style="color:#E1E4E8">    colors </span><span style="color:#F97583">Array</span><span style="color:#E1E4E8">(String),</span></span>
<span class="line"><span style="color:#E1E4E8">    condition_rating Float32,</span></span>
<span class="line"><span style="color:#E1E4E8">    price_dollars Float32,</span></span>
<span class="line"><span style="color:#F97583">    description</span><span style="color:#E1E4E8"> String,</span></span>
<span class="line"><span style="color:#E1E4E8">    embedding </span><span style="color:#F97583">Array</span><span style="color:#E1E4E8">(Float32),</span></span>
<span class="line"><span style="color:#E1E4E8">    date_added </span><span style="color:#F97583">DateTime</span></span>
<span class="line"><span style="color:#E1E4E8">) ENGINE </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> MergeTree()</span></span>
<span class="line"><span style="color:#F97583">ORDER BY</span><span style="color:#E1E4E8"> product_id;</span></span>
<span class="line"></span></code></pre>
<h3 id="clone-the-utility-files">Clone the utility files</h3>
<p>Next, we’re going to need to clone the repo that contains the files for generating and inserting our demonstration data:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#E1E4E8">gh repo clone portcullis</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">co</span><span style="color:#F97583">/</span><span style="color:#E1E4E8">nostalgia</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">bin</span></span>
<span class="line"></span></code></pre>
<p>This repo contains two important files, so lets take a look at them:</p>
<ul>
<li><strong>Generator.py - Creates a JSON file containing 10,000 product entries of various vintage items</strong></li>
<li><strong>Loader.py - Uses the JSON file from the generatos to create and load embeddings of the product entries into the <code>nostalgia_bin.embeddings</code> column</strong></li>
</ul>
<h3 id="generate-the-product-entries">Generate the product entries</h3>
<p>Now that you’ve cloned the utility files, the first thing to do is execute the generator file.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">python</span><span style="color:#9ECBFF"> ./generator.py</span></span>
<span class="line"></span></code></pre>
<p>A successful execution should look something like this:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#E1E4E8">nostalgia</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">bin % python .</span><span style="color:#F97583">/</span><span style="color:#79B8FF">generator</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">py</span></span>
<span class="line"><span style="color:#E1E4E8">Generating products: </span><span style="color:#79B8FF">100</span><span style="color:#E1E4E8">%|███████████████████████| </span><span style="color:#79B8FF">10000</span><span style="color:#F97583">/</span><span style="color:#79B8FF">10000</span><span style="color:#E1E4E8"> [00:01&#x3C;00:00, 9167.55it/s]</span></span>
<span class="line"><span style="color:#F97583">Generated</span><span style="color:#79B8FF"> 10000</span><span style="color:#E1E4E8"> vintage products </span><span style="color:#F97583">and</span><span style="color:#E1E4E8"> saved </span><span style="color:#F97583">to</span><span style="color:#79B8FF"> nostalgia_bin_products</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">json</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">Sample</span><span style="color:#E1E4E8"> Product:</span></span>
<span class="line"><span style="color:#E1E4E8">product_id: </span><span style="color:#79B8FF">2237</span></span>
<span class="line"><span style="color:#F97583">name</span><span style="color:#E1E4E8">: 1900s Figurine</span></span>
<span class="line"><span style="color:#E1E4E8">category: Home Decor</span></span>
<span class="line"><span style="color:#E1E4E8">subcategory: Figurines</span></span>
<span class="line"><span style="color:#E1E4E8">era: Victorian</span></span>
<span class="line"><span style="color:#E1E4E8">decade: </span><span style="color:#79B8FF">1900</span></span>
<span class="line"><span style="color:#E1E4E8">materials: ['Bronze']</span></span>
<span class="line"><span style="color:#E1E4E8">colors: ['Orange', 'Navy']</span></span>
<span class="line"><span style="color:#E1E4E8">condition_rating: </span><span style="color:#79B8FF">5</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">0</span></span>
<span class="line"><span style="color:#E1E4E8">price_dollars: </span><span style="color:#79B8FF">2280</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">0</span></span>
<span class="line"><span style="color:#F97583">description</span><span style="color:#E1E4E8">: This piece captures the zeitgeist of Belle Époque. Evokes a sense of nostalgia. Mint condition. Appears almost new despite its age. Museum quality piece. A pristine piece </span><span style="color:#F97583">from</span><span style="color:#E1E4E8"> the 1900s. Made </span><span style="color:#F97583">with</span><span style="color:#E1E4E8"> high</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">quality Bronze. The Orange </span><span style="color:#F97583">and</span><span style="color:#E1E4E8"> Navy colors evoke the 1900s aesthetic.</span></span>
<span class="line"><span style="color:#E1E4E8">date_added: </span><span style="color:#79B8FF">2022</span><span style="color:#F97583">-</span><span style="color:#79B8FF">06</span><span style="color:#F97583">-</span><span style="color:#79B8FF">19</span><span style="color:#79B8FF"> 16</span><span style="color:#E1E4E8">:</span><span style="color:#79B8FF">45</span><span style="color:#E1E4E8">:</span><span style="color:#79B8FF">47</span></span>
<span class="line"></span></code></pre>
<p>This will result in a JSON file named <code>nostalgia_bin_products.json</code>, which will be opened into the loader here:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="python"><code><span class="line"><span style="color:#F97583">with</span><span style="color:#79B8FF"> open</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'nostalgia_bin_products.json'</span><span style="color:#E1E4E8">, </span><span style="color:#9ECBFF">'r'</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> f:    </span></span>
<span class="line"><span style="color:#E1E4E8">products </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> json.load(f)</span></span>
<span class="line"></span></code></pre>
<h3 id="generate-and-load-embeddings">Generate and load embeddings</h3>
<p>Now we’re ready to generate our embeddings and load them into Clickhouse, but before we do we need to set our required environment variables:</p>
<ul>
<li><code>CLICKHOUSE_HOST</code></li>
<li><code>CLICKHOUSE_USERNAME</code></li>
<li><code>CLICKHOUSE_PASSWORD</code></li>
<li><code>OPENAI_API_KEY</code></li>
</ul>
<p>We’ve made this simple for you by adding an <code>.env.example</code>  file with placeholders for you to add your own credentials. Once you’ve added your credentials, run the loader and go grab some lunch because it can take awhile to finish:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="bash"><code><span class="line"><span style="color:#B392F0">python</span><span style="color:#9ECBFF"> ./loader.py</span></span>
<span class="line"></span></code></pre>
<p>The output should show progress, and when you’re finished, you can go into your Clickhouse instance and run this to see the embeddings:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#F97583">SELECT</span><span style="color:#E1E4E8"> embedding </span><span style="color:#F97583">from</span><span style="color:#E1E4E8"> nostalgia_bin</span></span>
<span class="line"></span></code></pre>
<p>If you see something like this, then you’ve completed Part 1 of this series!</p>
<p><img src="/blog/embeddings.png" alt="chat.svg"></p>
<h2 id="up-next">Up Next</h2>
<p>In the next part, we’re going to dive into how to use these embeddings to power vector similarity search in Clickhouse to create a recommendation engine for Nostalgia Bin.</p>
<p>We’ll learn how to effectively query this data using vector similarity, explain the concept behind cosine similarity searches, and implement a recommendation engine that surfaces items based on aesthetics rather than just keywords. Along the way, we’ll discuss how to architect the system to handle real-time recommendations while maintaining performance at scale.</p>`;
const frontmatter = { "title": "Building a vector-search powered recommendation engine for vintage products: Part 1", "description": "As the global zeitgeist begins to descend further and further into mindsets of throwing LLMs at every single thing and seeing what sticks, it becomes harder to differentiate craft and cruft.", "pubDate": "Mar 3 2025", "cover": "/blog/blog-cover-recommendation-engine.png", "category": "insights" };
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/blog/building-a-vintage-recommendation-engine-part-1.md";
const url = void 0;
function rawContent() {
  return "\nAs the global zeitgeist begins to descend further and further into mindsets of throwing LLMs at every single thing and seeing what sticks, it becomes harder to differentiate craft and cruft. Much like the early days of the dot-com era, there’s a million different “AI companies” who are dying to make a quick buck regardless of if their product actually provides value. \n\nThe fact I don’t see much of this is what makes me really enjoy the Clickhouse ecosystem. For the most part, everyone has a very high drive for curiosity-driven development and solving problems using their own pattern recognition skills. In the Clickhouse #help channels, there’s always a air of natural curiosity and a desire to learn more about this beast of an OSS data warehouse. \n\nOne of the Clickhouse features we’ve had a lot of clients asking questions about recently, and seen a lot of question on the Slack channels about is Vector indexing and search, so in response we’ve decided to write a 2 part blog series about building a recommendation engine for a vintage goods and furniture shop with Clickhouse. \n\n## Understanding the problem\n\nBefore we get started, we’re going to explore the problem we’re building for a little bit. Our imaginary client, Nostalgia Bin, is an online shop that specializes in curated vintage items and lost media from a wide range of generations. They've amassed a catalog of over 10,000 unique items, ranging from lost VHS tapes, Danish modern chairs to Italian glass lamps. Their challenge is connecting customers with items they'll love based on aesthetic preferences rather than just traditional category browsing.\n\nThe company has tried traditional text search and category filtering, but these approaches fail to capture the emotional and aesthetic connections that drive vintage purchases. That's where vector search comes in - by translating visual and descriptive elements into mathematical representations, we can build a system that truly understands the \"vibe\" a customer is looking for. We’re going to explore how we can leverage Clickhouse's vector capabilities to solve this unique recommendation challenge.\n\n## Generating the data\n\nFor this blog post, we need a realistic dataset that mirrors the diverse inventory of our fictional vintage shop. Rather than using a pre-existing dataset, we'll generate one that specifically captures the nuances of vintage products - their aesthetics, origins, materials, and the emotional responses they evoke.\n\nWe'll create approximately 10,000 product entries with detailed attributes including product name, category, era (decade of origin), materials, colors, condition rating, price point, and most importantly, a rich description that captures the unique character of each item. This descriptive text will serve as the foundation for our vector embeddings.\n\n### Create the schema\n\nFirst, let’s create our schema on Clickhouse with this structure:\n\n```sql\nCREATE TABLE nostalgia_bin (\n    product_id UInt32,\n    name String,\n    category String,\n    subcategory String,\n    era String,\n    decade UInt16,\n    materials Array(String),\n    colors Array(String),\n    condition_rating Float32,\n    price_dollars Float32,\n    description String,\n    embedding Array(Float32),\n    date_added DateTime\n) ENGINE = MergeTree()\nORDER BY product_id;\n```\n\n### Clone the utility files\n\nNext, we’re going to need to clone the repo that contains the files for generating and inserting our demonstration data:\n\n```sql\ngh repo clone portcullis-co/nostalgia-bin\n```\n\nThis repo contains two important files, so lets take a look at them:\n\n- **Generator.py - Creates a JSON file containing 10,000 product entries of various vintage items**\n- **Loader.py - Uses the JSON file from the generatos to create and load embeddings of the product entries into the `nostalgia_bin.embeddings` column**\n\n### Generate the product entries\n\nNow that you’ve cloned the utility files, the first thing to do is execute the generator file. \n\n```bash\npython ./generator.py\n```\n\nA successful execution should look something like this:\n\n```sql\nnostalgia-bin % python ./generator.py\nGenerating products: 100%|███████████████████████| 10000/10000 [00:01<00:00, 9167.55it/s]\nGenerated 10000 vintage products and saved to nostalgia_bin_products.json\n\nSample Product:\nproduct_id: 2237\nname: 1900s Figurine\ncategory: Home Decor\nsubcategory: Figurines\nera: Victorian\ndecade: 1900\nmaterials: ['Bronze']\ncolors: ['Orange', 'Navy']\ncondition_rating: 5.0\nprice_dollars: 2280.0\ndescription: This piece captures the zeitgeist of Belle Époque. Evokes a sense of nostalgia. Mint condition. Appears almost new despite its age. Museum quality piece. A pristine piece from the 1900s. Made with high-quality Bronze. The Orange and Navy colors evoke the 1900s aesthetic.\ndate_added: 2022-06-19 16:45:47\n```\n\nThis will result in a JSON file named `nostalgia_bin_products.json`, which will be opened into the loader here:\n\n```python\nwith open('nostalgia_bin_products.json', 'r') as f:    \nproducts = json.load(f)\n```\n\n### Generate and load embeddings\n\nNow we’re ready to generate our embeddings and load them into Clickhouse, but before we do we need to set our required environment variables:\n\n- `CLICKHOUSE_HOST`\n- `CLICKHOUSE_USERNAME`\n- `CLICKHOUSE_PASSWORD`\n- `OPENAI_API_KEY`\n\nWe’ve made this simple for you by adding an `.env.example`  file with placeholders for you to add your own credentials. Once you’ve added your credentials, run the loader and go grab some lunch because it can take awhile to finish:\n\n```bash\npython ./loader.py\n```\n\nThe output should show progress, and when you’re finished, you can go into your Clickhouse instance and run this to see the embeddings:\n\n```sql\nSELECT embedding from nostalgia_bin\n```\n\nIf you see something like this, then you’ve completed Part 1 of this series!\n\n![chat.svg](/blog/embeddings.png)\n\n## Up Next\n\nIn the next part, we’re going to dive into how to use these embeddings to power vector similarity search in Clickhouse to create a recommendation engine for Nostalgia Bin. \n\nWe'll learn how to effectively query this data using vector similarity, explain the concept behind cosine similarity searches, and implement a recommendation engine that surfaces items based on aesthetics rather than just keywords. Along the way, we'll discuss how to architect the system to handle real-time recommendations while maintaining performance at scale.";
}
function compiledContent() {
  return html;
}
function getHeadings() {
  return [{ "depth": 2, "slug": "understanding-the-problem", "text": "Understanding the problem" }, { "depth": 2, "slug": "generating-the-data", "text": "Generating the data" }, { "depth": 3, "slug": "create-the-schema", "text": "Create the schema" }, { "depth": 3, "slug": "clone-the-utility-files", "text": "Clone the utility files" }, { "depth": 3, "slug": "generate-the-product-entries", "text": "Generate the product entries" }, { "depth": 3, "slug": "generate-and-load-embeddings", "text": "Generate and load embeddings" }, { "depth": 2, "slug": "up-next", "text": "Up Next" }];
}
const Content = createComponent((result, _props, slots) => {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;
  return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
});
export {
  Content,
  compiledContent,
  Content as default,
  file,
  frontmatter,
  getHeadings,
  rawContent,
  url
};
