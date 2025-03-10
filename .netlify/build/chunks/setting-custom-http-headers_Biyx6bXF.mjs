import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, b as renderTemplate } from "./astro/server_aMtVhhw-.mjs";
import "clsx";
const html = `<p>The Clickhouse team and ecosystem is constantly pushing the envelope on new features and improving existing tools. If you didn’t catch it, the <a href="https://www.youtube.com/watch?v=bv-ut-Q6vnc&#x26;t=4s">Clickhouse v24.12 Release Call</a> had some really exciting new announcements that I’m excited to highlight today.  One interesting addition that may not seem like a huge “wow” feature, but is incredibly necessary for remote operations is the ability to set custom HTTP headers in SELECT statements.</p>
<p>This opens up new possibilities for authentication and authorization when querying external data sources as well as handling the content-type.</p>
<h2 id="what-was-missing">What was missing?</h2>
<p>Before the introduction of custom HTTP headers in SELECT statements, working with external HTTP sources had some limitations. When querying external HTTP endpoints, you were restricted to basic authentication methods and default headers. This made it challenging to work with APIs that required specific authentication tokens, custom content types, or other specialized headers.</p>
<p>Additionally, there was no standardized way to handle different authentication schemes across various data sources, which could lead to implementation inconsistencies. Organizations often had to resort to workarounds or additional middleware to handle these requirements properly.</p>
<h3 id="example-basic-http-request-before-custom-headers">Example: Basic HTTP Request Before Custom Headers</h3>
<p>Let’s look at a simple example of how we would previously query an HTTP endpoint in Clickhouse:</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#F97583">SELECT</span><span style="color:#F97583"> *</span><span style="color:#F97583"> FROM</span><span style="color:#F97583"> url</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'https://api.example.com/data'</span><span style="color:#E1E4E8">, JSONEachRow)</span></span>
<span class="line"></span></code></pre>
<p>This basic approach worked for simple cases but fell short when dealing with modern APIs that require authentication tokens or specific content-type headers.</p>
<h2 id="what-has-changed">What has changed?</h2>
<p>Now, Clickhouse users can add custom HTTP headers inline with their SELECT statements. This enhancement allows for better integration with secured APIs and services by supporting custom authentication headers, content-type specifications, and other HTTP header requirements. Let’s look at how this works in practice.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#F97583">CREATE OR REPLACE</span><span style="color:#F97583"> VIEW</span><span style="color:#B392F0"> pictures</span><span style="color:#F97583"> AS</span><span style="color:#F97583"> SELECT</span><span style="color:#9ECBFF"> \`...\`</span><span style="color:#F97583"> AS</span><span style="color:#E1E4E8"> img;</span></span>
<span class="line"><span style="color:#F97583">CREATE</span><span style="color:#F97583"> USER</span><span style="color:#B392F0"> viewer</span><span style="color:#E1E4E8"> SETTINGS http_response_headers </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> $\${</span><span style="color:#9ECBFF">'Content-Type'</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">'image/svg+xml'</span><span style="color:#E1E4E8">}$$;</span></span>
<span class="line"><span style="color:#E1E4E8">GRATE </span><span style="color:#F97583">SELECT</span><span style="color:#F97583"> ON</span><span style="color:#E1E4E8"> pictures </span><span style="color:#F97583">TO</span><span style="color:#E1E4E8"> user</span></span>
<span class="line"></span></code></pre>
<p>The example above demonstrates how to set custom HTTP headers when creating a view and granting access to users. This allows for proper content-type specification when serving images or other media files. Let’s explore a more common use case involving API authentication.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="sql"><code><span class="line"><span style="color:#F97583">SELECT</span><span style="color:#F97583"> *</span></span>
<span class="line"><span style="color:#F97583">FROM</span><span style="color:#F97583"> url</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'https://api.example.com/data'</span><span style="color:#E1E4E8">, JSONEachRow, </span></span>
<span class="line"><span style="color:#E1E4E8">    HEADERS(</span><span style="color:#9ECBFF">'Authorization: Bearer your-token-here'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#9ECBFF">            'Content-Type: application/json'</span><span style="color:#E1E4E8">));</span></span>
<span class="line"></span></code></pre>
<p>In this example, we’re adding both an authentication token and specifying the content type, which is essential when working with modern REST APIs.</p>
<h2 id="core-use-cases">Core Use Cases</h2>
<p>Let’s explore some of the key use cases where custom HTTP headers in SELECT statements prove particularly valuable:</p>
<ul>
<li>API Authentication - Seamlessly integrate with secured APIs by passing authentication tokens or API keys via headers</li>
<li>Content Type Negotiation - Specify the expected response format when dealing with endpoints that serve multiple content types</li>
<li>Custom Metadata - Pass additional context or tracking information through custom headers for better request management</li>
</ul>
<p>These custom headers provide a flexible way to handle various integration scenarios while maintaining security and data integrity. The ability to set headers directly in SELECT statements streamlines the development process and reduces the complexity of external data source interactions.</p>
<h2 id="conclusion">Conclusion</h2>
<p>The addition of custom HTTP headers in SELECT statements represents a significant enhancement to Clickhouse’s functionality, particularly for organizations working with external APIs and data sources. This feature simplifies integration workflows and provides greater flexibility in how we interact with external services. As Clickhouse continues to evolve, improvements like these demonstrate their commitment to making data operations more seamless and secure.</p>`;
const frontmatter = { "title": "Setting Custom HTTP Headers in SELECT statements in Clickhouse", "description": "As the world becomes more tech-driven, we rely more and more on rare earth metals to power our phones, appliances, and even lifesaving devices. The mining operations to gather these minerals have grown increasingly complex and sophisticated.", "pubDate": "Dec 25 2024", "cover": "/blog/blog-cover-http.png", "category": "insights" };
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/blog/setting-custom-http-headers.md";
const url = void 0;
function rawContent() {
  return "\nThe Clickhouse team and ecosystem is constantly pushing the envelope on new features and improving existing tools. If you didn’t catch it, the [Clickhouse v24.12 Release Call](https://www.youtube.com/watch?v=bv-ut-Q6vnc&t=4s) had some really exciting new announcements that I’m excited to highlight today.  One interesting addition that may not seem like a huge “wow” feature, but is incredibly necessary for remote operations is the ability to set custom HTTP headers in SELECT statements. \n\nThis opens up new possibilities for authentication and authorization when querying external data sources as well as handling the content-type. \n\n## What was missing?\n\nBefore the introduction of custom HTTP headers in SELECT statements, working with external HTTP sources had some limitations. When querying external HTTP endpoints, you were restricted to basic authentication methods and default headers. This made it challenging to work with APIs that required specific authentication tokens, custom content types, or other specialized headers.\n\nAdditionally, there was no standardized way to handle different authentication schemes across various data sources, which could lead to implementation inconsistencies. Organizations often had to resort to workarounds or additional middleware to handle these requirements properly.\n\n### Example: Basic HTTP Request Before Custom Headers\n\nLet's look at a simple example of how we would previously query an HTTP endpoint in Clickhouse:\n\n```sql\nSELECT * FROM url('https://api.example.com/data', JSONEachRow)\n```\n\nThis basic approach worked for simple cases but fell short when dealing with modern APIs that require authentication tokens or specific content-type headers.\n\n## What has changed?\n\nNow, Clickhouse users can add custom HTTP headers inline with their SELECT statements. This enhancement allows for better integration with secured APIs and services by supporting custom authentication headers, content-type specifications, and other HTTP header requirements. Let's look at how this works in practice.\n\n```sql\nCREATE OR REPLACE VIEW pictures AS SELECT `...` AS img;\nCREATE USER viewer SETTINGS http_response_headers = $${'Content-Type': 'image/svg+xml'}$$;\nGRATE SELECT ON pictures TO user\n```\n\nThe example above demonstrates how to set custom HTTP headers when creating a view and granting access to users. This allows for proper content-type specification when serving images or other media files. Let's explore a more common use case involving API authentication.\n\n```sql\nSELECT *\nFROM url('https://api.example.com/data', JSONEachRow, \n    HEADERS('Authorization: Bearer your-token-here',\n            'Content-Type: application/json'));\n```\n\nIn this example, we're adding both an authentication token and specifying the content type, which is essential when working with modern REST APIs.\n\n## Core Use Cases\n\nLet's explore some of the key use cases where custom HTTP headers in SELECT statements prove particularly valuable:\n\n- API Authentication - Seamlessly integrate with secured APIs by passing authentication tokens or API keys via headers\n- Content Type Negotiation - Specify the expected response format when dealing with endpoints that serve multiple content types\n- Custom Metadata - Pass additional context or tracking information through custom headers for better request management\n\nThese custom headers provide a flexible way to handle various integration scenarios while maintaining security and data integrity. The ability to set headers directly in SELECT statements streamlines the development process and reduces the complexity of external data source interactions.\n\n## Conclusion\n\nThe addition of custom HTTP headers in SELECT statements represents a significant enhancement to Clickhouse's functionality, particularly for organizations working with external APIs and data sources. This feature simplifies integration workflows and provides greater flexibility in how we interact with external services. As Clickhouse continues to evolve, improvements like these demonstrate their commitment to making data operations more seamless and secure.";
}
function compiledContent() {
  return html;
}
function getHeadings() {
  return [{ "depth": 2, "slug": "what-was-missing", "text": "What was missing?" }, { "depth": 3, "slug": "example-basic-http-request-before-custom-headers", "text": "Example: Basic HTTP Request Before Custom Headers" }, { "depth": 2, "slug": "what-has-changed", "text": "What has changed?" }, { "depth": 2, "slug": "core-use-cases", "text": "Core Use Cases" }, { "depth": 2, "slug": "conclusion", "text": "Conclusion" }];
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
