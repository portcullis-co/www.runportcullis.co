import { a as createComponent, r as renderComponent, b as renderTemplate } from "../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$Bentogrid } from "../chunks/bentogrid_CyHOjrBJ.mjs";
import { $ as $$HeroLanding, a as $$InfoLanding, i as infos, b as $$Features } from "../chunks/info-landing_3efAHxZm.mjs";
import { $ as $$MainLayout } from "../chunks/main-layout_Dz18vA4v.mjs";
import { renderers } from "../renderers.mjs";
const $$Landing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Landing" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroLanding", $$HeroLanding, {})} ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})} ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[1] })} ${renderComponent($$result2, "Features", $$Features, {})}  ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[0], "reverse": true })} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/landing.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/landing.astro";
const $$url = "/landing";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Landing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
