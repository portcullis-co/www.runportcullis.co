import { a as createComponent, b as renderTemplate, r as renderComponent, m as maybeRenderHead } from "../../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$Bentogrid } from "../../chunks/bentogrid_CyHOjrBJ.mjs";
import { $ as $$HeroSection } from "../../chunks/hero-section_C-76lgOT.mjs";
import { $ as $$MainLayout, d as Button } from "../../chunks/main-layout_Dz18vA4v.mjs";
import { $ as $$Icon } from "../../chunks/Icon_CIygrEIG.mjs";
import { $ as $$HeaderSection } from "../../chunks/header-section_Va4gOp5y.mjs";
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$QueryOptimization = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Query Optomization | Your Company Name";
  const pageDescription = "Professional query optomization for your data warehouse environments";
  return renderTemplate(_a || (_a = __template(["", ` <script>
  document.addEventListener('DOMContentLoaded', () => {
    const intercomButtons = document.querySelectorAll('[id^="intercom-button"]');
    intercomButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (window.Intercom) {
          // Open Intercom Messenger
          window.Intercom('show');
          console.log('Intercom opened');
        } else {
          console.error('Intercom is not initialized');
        }
      });
    });
  });
<\/script>`])), renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": "Query Optimization Advisory", "subtitle": "Task us with identifying key improvement areas in your query strategy", "heroImg": "https://thumbs.dreamstime.com/b/network-servers-data-center-white-background-reflections-top-view-65346928.jpg", "overlay": "" })} ${maybeRenderHead()}<section> <div class="pb-6 pt-28"> <div class="container max-w-6xl"> ${renderComponent($$result2, "HeaderSection", $$HeaderSection, { "label": "How we optimize", "title": "Squeeze every last bit of juice from your data warehouse 🍊", "subtitle": "Let us find hidden optimization opportunities in your data warehouse" })} <div class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"> <!-- Feature 1 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:cloud", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Format Analysis</h3> <p class="mt-6 pb-6 text-muted-foreground">
We'll make sure you're using the best query format for the job and if not, we'll help you switch to a new one.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a id="null" class="flex items-center gap-2 cursor-pointer"> <span>Talk to us</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 2 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:database", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Table Engine</h3> <p class="mt-6 pb-6 text-muted-foreground">
We'll look at how you're using your chosen table engine and see if there are any improvements to be made
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a id="intercom-button-2" class="flex items-center gap-2 cursor-pointer"> <span>Talk to us</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 3 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:server", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Client Audit</h3> <p class="mt-6 pb-6 text-muted-foreground">
We'll do a full review of your client implementation to see if there is anything slowing down your queries
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a id="intercom-button-3" class="flex items-center gap-2 cursor-pointer"> <span>Discuss Project</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> </div></div></div></section> ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})} ` }));
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/services/query-optimization.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/services/query-optimization.astro";
const $$url = "/services/query-optimization";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$QueryOptimization,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
