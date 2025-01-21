import { s as createComponent, t as renderTemplate, u as renderComponent } from './astro/server_C2DrDyYu.mjs';
import { $ as $$Bentogrid } from './bentogrid_BzmAoUDA.mjs';
import { $ as $$HeroLanding, a as $$InfoLanding, i as infos, b as $$Features } from './info-landing_CdmsFk24.mjs';
import { $ as $$MainLayout } from './main-layout_D8Sy9k_x.mjs';

const $$Landing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Landing" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroLanding", $$HeroLanding, {})} ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})} ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[1] })} ${renderComponent($$result2, "Features", $$Features, {})}  ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[0], "reverse": true })} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/landing.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/landing.astro";
const $$url = "/landing";

export { $$Landing as default, $$file as file, $$url as url };
