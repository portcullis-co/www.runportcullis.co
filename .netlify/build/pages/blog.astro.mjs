import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { g as getPosts, $ as $$BlogHeader, a as $$BlogCard } from "../chunks/blog-card_Dl6nt5bm.mjs";
import { $ as $$MainLayout } from "../chunks/main-layout_C4s2EEtb.mjs";
import { renderers } from "../renderers.mjs";
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getPosts();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Portcullis Blog" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container py-10"> ${renderComponent($$result2, "BlogHeader", $$BlogHeader, { "title": "Portcullis Blog" })} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 md:gap-y-11 lg:gap-y-16 lg:gap-x-8"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "BlogCard", $$BlogCard, { ...post })}`)} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/index.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/index.astro";
const $$url = "/blog";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
