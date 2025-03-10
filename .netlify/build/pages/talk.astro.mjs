import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$MainLayout } from "../chunks/main-layout_Dz18vA4v.mjs";
import { renderers } from "../renderers.mjs";
const $$Talk = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Talk to Portcullis", "mainClass": "flex-1 bg-background-200" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="flex items-center justify-center min-h-screen"> <div class="flex flex-col gap-4 w-full max-w-[58rem] items-center p-4"> ${renderComponent($$result2, "PortcullisBot", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/assistant/ui/index", "client:component-export": "PortcullisBot" })} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/talk.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/talk.astro";
const $$url = "/talk";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Talk,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
