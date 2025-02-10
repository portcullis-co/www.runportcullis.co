import { a as createComponent, r as renderTemplate, b as renderComponent } from '../chunks/astro/server_Dkj-vugl.mjs';
import { $ as $$Bentogrid } from '../chunks/bentogrid_B6OSVCPz.mjs';
import { $ as $$HeroLanding, b as $$Features, a as $$InfoLanding, i as infos } from '../chunks/info-landing_BhxZJjuw.mjs';
import { $ as $$MainLayout } from '../chunks/main-layout_D_DuIfBx.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Portcullis" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroLanding", $$HeroLanding, {})} ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})}  ${renderComponent($$result2, "Features", $$Features, {})}  ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[0], "reverse": true })} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
