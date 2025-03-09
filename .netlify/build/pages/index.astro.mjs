import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate } from "../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$Bentogrid } from "../chunks/bentogrid_CyHOjrBJ.mjs";
import { $ as $$HeroLanding, b as $$Features, a as $$InfoLanding, i as infos } from "../chunks/info-landing_B5KOV35L.mjs";
import { $ as $$MainLayout } from "../chunks/main-layout_MwNyqyy3.mjs";
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro("https://www.runportcullis.co");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  Astro2.url.pathname;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Portcullis" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroLanding", $$HeroLanding, {})} ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})}  ${renderComponent($$result2, "Features", $$Features, {})}  ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[0], "reverse": true })} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro";
const $$url = "";
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
