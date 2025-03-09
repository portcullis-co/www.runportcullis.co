import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../../../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$BlogHeader, a as $$BlogCard } from "../../../chunks/blog-card_s5NB-PVN.mjs";
import { c as capitalizer, $ as $$MainLayout } from "../../../chunks/main-layout_BsXR2W6X.mjs";
import { g as getCollection } from "../../../chunks/_astro_content_CfZ2RNgK.mjs";
import { renderers } from "../../../renderers.mjs";
const $$Astro = createAstro("https://www.runportcullis.co");
async function getStaticPaths() {
  const allPosts = await getCollection("blog");
  const uniqueCategories = [
    ...new Set(allPosts.map((post) => post.data.category).flat())
  ];
  return uniqueCategories.map((category) => {
    const filteredPosts = allPosts.filter((post) => post.data.category.includes(category)).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    return {
      params: { category },
      props: { posts: filteredPosts }
    };
  });
}
const $$category = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  const { posts } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `${capitalizer(category)} | Blog`, "description": `All posts for ${category} category` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container py-10"> ${renderComponent($$result2, "BlogHeader", $$BlogHeader, { "title": `Posts by ${category} category` })} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 md:gap-y-16 lg:gap-x-8"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "BlogCard", $$BlogCard, { ...post })}`)} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/category/[category].astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/category/[category].astro";
const $$url = "/blog/category/[category]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
