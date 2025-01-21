import { q as createAstro, s as createComponent, t as renderTemplate, v as maybeRenderHead, w as addAttribute, B as spreadAttributes, u as renderComponent } from './astro/server_C2DrDyYu.mjs';
import { a as cn, B as Badge, f as formatDate, $ as $$MainLayout } from './main-layout_D8Sy9k_x.mjs';
import 'clsx';
import { g as getCollection } from './_astro_content_2QeJHiIK.mjs';

const $$Astro$1 = createAstro("https://www.runportcullis.co");
const $$PageHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PageHeader;
  const { heading, text, className, ...attrs } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(cn("space-y-4", className), "class")}${spreadAttributes(attrs)}> <h1 class="inline-block font-heading text-4xl"> ${heading} </h1> ${text && renderTemplate`<p class="text-muted-foreground">${text}</p>`} </div> <hr class="my-4">`;
}, "/Users/jdbohrman/www.runportcullis.co/src/components/page-header.astro", void 0);

const $$Astro = createAstro("https://www.runportcullis.co");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const posts = await getCollection("releases");
  posts.sort((a, b) => +b.data.date - +a.data.date);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Changelog" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container max-w-screen-lg space-y-6 pt-12"> ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Changelog", "text": "Reproduce Astro Starlog template with Tailwind CSS & shadcn/ui." })} <ul class="pt-6"> ${posts.map((post) => renderTemplate`<li class="flex flex-col max-md:gap-y-4 md:flex-row w-full"> <div class="md:basis-32 lg:basis-56 shrink-0 grow-0"> <div class="md:sticky md:top-24 w-auto mr-6"> <a${addAttribute(`/releases/${post.slug}`, "href")} class="flex flex-col gap-y-2 pb-4"> ${renderComponent($$result2, "Badge", Badge, { "variant": "default", "radius": "lg", "className": "w-14 h-7 justify-center text-md bg_release_version text-white" }, { "default": ($$result3) => renderTemplate`${post.data.versionNumber}` })} <span class="text-sm text-muted-foreground"> ${formatDate(post.data.date)} </span> </a> </div> </div> <div class="prose dark:prose-invert prose-img:rounded-3xl max-w-none w-full pb-24"> ${post.render().then(({ Content }) => renderTemplate`${renderComponent($$result2, "Content", Content, {})}`)} </div> </li>`)} </ul> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/releases/index.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/releases/index.astro";
const $$url = "/releases";

export { $$Index as default, $$file as file, $$url as url };
