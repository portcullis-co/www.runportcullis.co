import { a as createComponent, b as renderTemplate, r as renderComponent, m as maybeRenderHead } from "../../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$Bentogrid } from "../../chunks/bentogrid_CyHOjrBJ.mjs";
import { $ as $$HeroSection } from "../../chunks/hero-section_WSqrwR9G.mjs";
import { $ as $$ProcessSteps } from "../../chunks/process-steps_CHD84ZFa.mjs";
import { $ as $$MainLayout, d as Button } from "../../chunks/main-layout_BsXR2W6X.mjs";
import { $ as $$Icon } from "../../chunks/Icon_B1sMsFyE.mjs";
import { $ as $$HeaderSection } from "../../chunks/header-section_Va4gOp5y.mjs";
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$ProjectPlanning = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Project Planning and Research | Portcullis";
  const pageDescription = "Get high-level project planning and architecture design to ensure your data warehouse is built to last";
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
  <\/script>`])), renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": "High-level project planning", "subtitle": "Get high-level project planning and architecture design to ensure your data warehouse is built to last", "heroImg": "https://images.pexels.com/photos/688890/pexels-photo-688890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "overlay": "https://clickhouse.com/_next/image?url=%2Fimages%2Fclickhouse%2Foss_hero_image.png&w=3840&q=75" })} ${maybeRenderHead()}<section> <div class="pb-6 pt-28"> <div class="container max-w-6xl"> ${renderComponent($$result2, "HeaderSection", $$HeaderSection, { "label": "Services", "title": "Access to a hybrid team of Clickhouse experts and LLMs", "subtitle": "Get your projects planning in a fraction of the time it would take to do it yourself" })} <div class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"> <!-- Feature 1 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:cloud", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">On-demand Support</h3> <p class="mt-6 pb-6 text-muted-foreground">
Get help when you need it from our team of data engineers.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/pricing" class="flex items-center gap-2"> <span>See our pricing</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 2 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:database", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Data Optimization</h3> <p class="mt-6 pb-6 text-muted-foreground">
Improve the performance and efficiency of your data warehouse.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/pricing" class="flex items-center gap-2"> <span>See our pricing</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 3 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:server", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Research and Analysis</h3> <p class="mt-6 pb-6 text-muted-foreground">
Get custom reports and dashboards to help you make data-driven decisions.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/pricing" class="flex items-center gap-2"> <span>See our pricing</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 4 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:wrench", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Custom Dashboards</h3> <p class="mt-6 pb-6 text-muted-foreground">
Get near-instant dashboards to help you make data-driven decisions.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/pricing" class="flex items-center gap-2"> <span>See our pricing</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 5 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:settings", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Monitoring & Alerts</h3> <p class="mt-6 pb-6 text-muted-foreground">
Receive proactive monitoring and alerting to stay ahead of issues.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/pricing" class="flex items-center gap-2"> <span>See our pricing</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 6 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:shield", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Security & Compliance</h3> <p class="mt-6 pb-6 text-muted-foreground">
Safeguard your data and ensure compliance.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/pricing" class="flex items-center gap-2"> <span>See our pricing</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> </div> </div> </div> </section> ${renderComponent($$result2, "BentoGrid", $$Bentogrid, {})} ${renderComponent($$result2, "ProcessSteps", $$ProcessSteps, {})} ` }));
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/services/project-planning.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/services/project-planning.astro";
const $$url = "/services/project-planning";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ProjectPlanning,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
