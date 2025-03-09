import rss from "@astrojs/rss";
import { g as getCollection } from "../chunks/_astro_content_SpGMFWnl.mjs";
import { s as siteConfig } from "../chunks/site_BgoAjukA.mjs";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { renderers } from "../renderers.mjs";
const parser = new MarkdownIt();
async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      link: `/blog/${post.slug}/`,
      // Note: this will not process components or JSX expressions in MDX files.
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"])
      }),
      ...post.data
    }))
  });
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
