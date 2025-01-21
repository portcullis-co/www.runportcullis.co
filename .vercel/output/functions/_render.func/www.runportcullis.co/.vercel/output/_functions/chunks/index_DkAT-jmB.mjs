import { s as createComponent, t as renderTemplate, u as renderComponent } from './astro/server_C2DrDyYu.mjs';
import { $ as $$Bentogrid } from './bentogrid_BzmAoUDA.mjs';
import { $ as $$HeroLanding, b as $$Features, a as $$InfoLanding, i as infos } from './info-landing_BrLceIPf.mjs';
import { $ as $$MainLayout } from './main-layout_Bd35tQXg.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Portcullis" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroLanding", $$HeroLanding, {})} ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})}  ${renderComponent($$result2, "Features", $$Features, {})}  ${renderComponent($$result2, "InfoLanding", $$InfoLanding, { "data": infos[0], "reverse": true })} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
