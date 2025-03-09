import { c as createAstro, a as createComponent, b as renderTemplate, d as addAttribute, m as maybeRenderHead } from "./astro/server_aMtVhhw-.mjs";
import "clsx";
import { a as cn, b as buttonVariants } from "./main-layout_MwNyqyy3.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.runportcullis.co");
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HeroSection;
  const { title, subtitle, heroImg, overlay } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '<section class="relative bg-white overflow-hidden"> <div class="absolute inset-0"> <div class="absolute inset-0 bg-white"></div> <div class="absolute inset-0 bg-grid-black/[0.05] bg-grid-16"></div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20 md:py-28"> <!-- Left Column --> <div> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"> ', ' </h1> <p class="text-lg md:text-xl text-gray-700 mb-6"> ', ' </p> <div class="mt-8"> <a href="/pricing"> <button', '> <span class="ml-2">Open a channel</span> <img class="h-11 w-11" src="https://cdn.brandfetch.io/idJ_HhtG0Z/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"> </button> </a> </div> </div> <!-- Right Column --> <div class="relative"> <!-- Main Image --> <img', ' alt="Descriptive alt text" class="object-cover w-full h-full rounded-lg shadow-md"> <!-- Overlay Image --> <img', ` alt="Overlay" class="absolute top-1/2 left-1/2 w-3/4 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg"> </div> </div> </div> </section> <script>
  document.addEventListener('DOMContentLoaded', () => {
    const deploymentIntercom = document.getElementById('intercom-button');
    if (deploymentIntercom) {
      deploymentIntercom.addEventListener('click', () => {
        if (window.Intercom) {
          // Open Intercom Messenger
          window.Intercom('show');
          console.log('Intercom opened via Deployment Support Page');
        } else {
          console.error('Intercom is not initialized');
        }
      });
    }
  });
<\/script>`])), maybeRenderHead(), title, subtitle, addAttribute(cn(
    buttonVariants({ size: "lg", rounded: "full" }),
    "gap-2 bg-black text-white hover:opacity-90 transition-all duration-300 shadow-md"
  ), "class"), addAttribute(heroImg, "src"), addAttribute(overlay, "src"));
}, "/Users/jdbohrman/www.runportcullis.co/src/components/sections/hero-section.astro", void 0);
export {
  $$HeroSection as $
};
