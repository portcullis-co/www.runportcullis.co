import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$MainLayout, d as Button } from "../chunks/main-layout_C4s2EEtb.mjs";
import { $ as $$Icon } from "../chunks/Icon_C7xTG8EG.mjs";
import { renderers } from "../renderers.mjs";
const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "About", "description": "Lorem ipsum dolor sit amet" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="space-y-5"> <section class="relative container max-w-screen-md mb-28 mt-16 sm:mt-20 lg:mt-28"> <div class="flex h-full flex-col justify-between"> <div class="grid gap-8 sm:grid-cols-2"> <div> <h1 class="text-4xl font-heading text-foreground">Portcullis</h1> <p class="text-base text-muted-foreground mt-0.5">
Made with ❤️ in Knoxville, TN
</p> </div> <div> <p class="mb-12 text-base text-muted-foreground">
Have something you'd like to talk about?
<br>
Send us a message and we'll get back to you as soon as possible.
</p> <div class="flex items-center gap-3"> ${renderComponent($$result2, "Button", Button, { "className": "rounded-xl" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:mail", "class": "mr-2 size-4" })} <a href="mailto:hello@runportcullis.co">Talk with us</a> ` })} </div> </div> </div> </div> </section> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/contact.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/contact.astro";
const $$url = "/contact";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
