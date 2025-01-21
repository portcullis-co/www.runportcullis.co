import { s as createComponent, t as renderTemplate, u as renderComponent, v as maybeRenderHead } from './astro/server_C2DrDyYu.mjs';
import { $ as $$HeroSection } from './hero-section_t2zDoIYw.mjs';
import { d as $$Icon, e as Button, $ as $$MainLayout } from './main-layout_Bd35tQXg.mjs';
import { $ as $$HeaderSection } from './header-section_7VE656Ye.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$ContentWriting = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Content Writing Services | Portcullis";
  const pageDescription = "High-quality, professional Clickhouse-focused content writing services to boost your brand's visibility and engagement.";
  const steps = [
    {
      number: "01",
      title: "Assessment",
      description: "We analyze your current infrastructure and product vertical to create a strategy."
    },
    {
      number: "02",
      title: "Planning",
      description: "Develop a detailed content plan including topics, graphic ideas, and sharing targets."
    },
    {
      number: "03",
      title: "Creation",
      description: "Create the content over a period of time, depending on our arrangement."
    },
    {
      number: "04",
      title: "Finalization",
      description: "Finalize your content drafts and prepare assets for posting."
    },
    {
      number: "05",
      title: "Promotion",
      description: "Collaborate with you on sharing and disseminating your content around the data community."
    },
    {
      number: "06",
      title: "Maintenance",
      description: "Ongoing support, monitoring, and optimization of your traffic and content performance."
    }
  ];
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
<\/script>`])), renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": "Like our blog? Let us make yours like that", "subtitle": "Get hand-written data engineering content for your blog along with on-brand graphics and visuals", "heroImg": "https://img.freepik.com/premium-photo/black-white-photo-vintage-typewriter-with-label-that-says-rock-star-top_14117-18278.jpg", "overlay": "" })} ${maybeRenderHead()}<section> <div class="pb-6 pt-28"> <div class="container max-w-6xl"> ${renderComponent($$result2, "HeaderSection", $$HeaderSection, { "label": "Services", "title": "Engaging, Tailored Content Writing for Your Business", "subtitle": "Our engineering expertise paired with our ability to write prose makes for engaging and fun content" })} <div class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"> <!-- Feature 1 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:edit", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">SEO Blog Writing</h3> <p class="mt-6 pb-6 text-muted-foreground">
Boost your website's visibility with high-quality SEO-optimized blog posts.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/schedule-a-chat" class="flex items-center gap-2" id="null"> <span>Get a Quote</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 2 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:file-text", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Web Copywriting</h3> <p class="mt-6 pb-6 text-muted-foreground">
Engage visitors with compelling copy for your website that drives conversions.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/schedule-a-chat" class="flex items-center gap-2" id="intercom-button-2"> <span>Discuss Project</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 3 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:pen-tool", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Product Descriptions</h3> <p class="mt-6 pb-6 text-muted-foreground">
Write clear, persuasive descriptions that help customers make informed purchasing decisions.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/schedule-a-chat" class="flex items-center gap-2" id="intercom-button-3"> <span>Discuss Project</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 4 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:file", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Email Campaigns</h3> <p class="mt-6 pb-6 text-muted-foreground">
Create engaging email content to drive action from your audience.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/schedule-a-chat" class="flex items-center gap-2" id="intercom-button-4"> <span>Discuss Project</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 5 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:book", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">E-books & Guides</h3> <p class="mt-6 pb-6 text-muted-foreground">
Create informative and engaging e-books to establish thought leadership.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/schedule-a-chat" class="flex items-center gap-2" id="intercom-button-5"> <span>Discuss Project</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> <!-- Feature 6 --> <div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:shield", "class": "m-auto text-foreground" })} </div> <h3 class="mt-4 text-xl font-semibold text-foreground">Technical Writing</h3> <p class="mt-6 pb-6 text-muted-foreground">
Professional documentation and manuals for complex topics.
</p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result2, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result3) => renderTemplate` <a href="/schedule-a-chat" class="flex items-center gap-2" id="intercom-button-6"> <span>Discuss Project</span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div> </div> </div> </div> </section> <section class="relative bg-white overflow-hidden py-20"> <div class="absolute inset-0"> <div class="absolute inset-0 bg-white"></div> <div class="absolute inset-0 bg-grid-black/[0.05] bg-grid-16"></div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> <div class="text-center mb-16"> <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Writing Process</h2> <p class="text-xl text-gray-700">A systematic approach to ensure highly engaging content</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${steps.map((step) => renderTemplate`<div class="relative group"> <div class="absolute -inset-0.5 bg-gradient-to-r from-[#faff69] to-black rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-300"></div> <div class="relative p-6 bg-white rounded-lg shadow-md"> <div class="text-5xl font-bold text-black mb-4">${step.number}</div> <h3 class="text-xl font-semibold text-gray-900 mb-2">${step.title}</h3> <p class="text-gray-700">${step.description}</p> </div> </div>`)} </div> </div> </section> ` }));
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/services/content-writing.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/services/content-writing.astro";
const $$url = "/services/content-writing";

export { $$ContentWriting as default, $$file as file, $$url as url };
