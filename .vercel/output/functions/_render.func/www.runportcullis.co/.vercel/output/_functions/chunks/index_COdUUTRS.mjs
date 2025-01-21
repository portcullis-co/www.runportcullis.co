import { s as createComponent, t as renderTemplate, u as renderComponent, v as maybeRenderHead } from './astro/server_C2DrDyYu.mjs';
import { g as getPosts, $ as $$BlogHeader, a as $$BlogCard } from './blog-card_B1C_T_CR.mjs';
import { $ as $$MainLayout } from './main-layout_Bd35tQXg.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getPosts();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Portcullis Blog" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container py-10"> ${renderComponent($$result2, "BlogHeader", $$BlogHeader, { "title": "Portcullis Blog" })} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 md:gap-y-11 lg:gap-y-16 lg:gap-x-8"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "BlogCard", $$BlogCard, { ...post })}`)} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/index.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/index.astro";
const $$url = "/blog";

export { $$Index as default, $$file as file, $$url as url };
