import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead } from './astro/server_DlAcna1r.mjs';
import 'clsx';

const $$Astro = createAstro("https://www.runportcullis.co");
const $$HeaderSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HeaderSection;
  const { label, title, subtitle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col items-center text-center"> ${label ? renderTemplate`<div class="text-gradient_primary mb-4 font-semibold">${label}</div>` : null} <h2 class="font-heading text-3xl md:text-4xl lg:text-[40px]"> ${title} </h2> ${subtitle ? renderTemplate`<p class="mt-6 text-balance text-lg text-muted-foreground">${subtitle}</p>` : null} </div>`;
}, "/Users/jdbohrman/www.runportcullis.co/src/components/sections/header-section.astro", undefined);

export { $$HeaderSection as $ };
