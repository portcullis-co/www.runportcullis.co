import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, f as renderSlot } from './astro/server_Dkj-vugl.mjs';
import { $ as $$MainLayout, f as formatDate } from './main-layout_D_DuIfBx.mjs';
import { $ as $$Image } from './_astro_assets_DoAXWItE.mjs';

const $$Astro = createAstro("https://www.runportcullis.co");
const $$VsLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$VsLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": frontmatter.title, "description": frontmatter.description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative container max-w-screen-md py-10"> <article class="prose dark:prose-invert max-w-none"> ${frontmatter.cover && renderTemplate`${renderComponent($$result2, "Image", $$Image, { "class": "rounded-xl overflow-hidden my-6", "width": 720, "height": 360, "src": frontmatter.cover, "alt": frontmatter.title })}`} <div class="flex items-center justify-between"> <span class="font-medium text-muted-foreground"> ${formatDate(frontmatter.pubDate)} ${frontmatter.updatedDate && renderTemplate`<span> - Last updated on ${formatDate(frontmatter.updatedDate)}</span>`} </span> </div> <h1 class="font-heading text-4xl my-4">${frontmatter.title}</h1> ${frontmatter.description && renderTemplate`<p>${frontmatter.description}</p>`} <hr class="my-6"> ${renderSlot($$result2, $$slots["default"])} </article> </div> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/layouts/vs-layout.astro", void 0);

export { $$VsLayout as $ };
