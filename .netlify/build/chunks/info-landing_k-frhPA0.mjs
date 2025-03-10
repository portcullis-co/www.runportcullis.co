import { a as createComponent, m as maybeRenderHead, r as renderComponent, b as renderTemplate, d as addAttribute, c as createAstro } from "./astro/server_aMtVhhw-.mjs";
import { d as Button, a as cn, b as buttonVariants } from "./main-layout_Dz18vA4v.mjs";
import { $ as $$Icon } from "./Icon_BY_CdGcZ.mjs";
import { $ as $$HeaderSection } from "./header-section_Va4gOp5y.mjs";
const infos = [
  {
    title: "Get the most value out of your Data Warehouse investment",
    description: "Portcullis is here to help you with reaching maximum ROI on your commitment to data warehousing",
    image: "/images/blog/placeholder-about.jpg",
    list: [
      {
        title: "Engineer-founded",
        description: "Portcullis was founded by engineers and understands the ins and outs of terabyte-scale data warehousing.",
        icon: "lucide:code"
      },
      {
        title: "White-glove",
        description: "It might sound cringe, but we treat our clients like family. We can't work with everyone, but the people we can we make sure have the best CS.",
        icon: "lucide:hand-heart"
      },
      {
        title: "Experimental by nature, pragmatic by default",
        description: "We absolutely love trying new and bleeding edge things to solve problems, while keeping ourselves grounded where needed",
        icon: "lucide:scale"
      }
    ]
  },
  {
    title: "Seamless Integration",
    description: "Integrate our open-source Portcullis seamlessly into your existing workflows. Effortlessly connect with your favorite tools and services for a streamlined experience.",
    image: "/images/blog/placeholder-about.jpg",
    list: [
      {
        title: "Flexible",
        description: "Customize your integrations to fit your unique requirements.",
        icon: "lucide:laptop"
      },
      {
        title: "Efficient",
        description: "Streamline your processes and reducing manual effort.",
        icon: "lucide:search"
      },
      {
        title: "Reliable",
        description: "Rely on our robust infrastructure and comprehensive documentation.",
        icon: "lucide:settings"
      }
    ]
  }
];
const features = [
  {
    title: "Project Scoping",
    description: "We thrive in high level, tip of the spear advisory roles for complex data warehousing projects",
    link: "/pricing",
    icon: "lucide:microscope"
  },
  {
    title: "Analytics",
    description: "Contact us for support optimizing and gaining insights into your analytics",
    link: "/pricing",
    icon: "lucide:activity"
  },
  {
    title: "Custom Dashboards",
    description: "Use our methodology and tools or let us support you with custom dashboards",
    link: "/pricing",
    icon: "lucide:layers"
  },
  {
    title: "Bespoke Behaviour and UDFs",
    description: "Connect with us to see how we can help you extract unique behaviour out of your Clickhouse instances",
    link: "/pricing",
    icon: "lucide:wand-sparkles"
  },
  {
    title: "Optimization",
    description: "Need help optimizing your queries? Let us help you with that.",
    link: "/pricing",
    icon: "lucide:database"
  },
  {
    title: "Report Creation",
    description: "We can help you with writing implementation reports for your POCs",
    link: "/pricing",
    icon: "lucide:file-chart-column"
  }
];
const $$Features = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> <div class="pb-6 pt-28"> <div class="container max-w-6xl"> ${renderComponent($$result, "HeaderSection", $$HeaderSection, { "label": "Features", "title": "High-level advisory support for planning stage projects", "subtitle": "We provide deep insights and support to projects still in their early stages" })} <div class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"> ${features.map((feature) => renderTemplate`<div class="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"> <div aria-hidden="true" class="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-black to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"></div> <div class="relative"> <div class="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6 "> ${renderComponent($$result, "Icon", $$Icon, { "name": feature.icon, "class": "m-auto text-foreground" })} </div> <!-- Feature Title --> <h3 class="mt-4 text-xl font-semibold text-foreground">${feature.title}</h3> <p class="mt-6 pb-6 text-muted-foreground"> ${feature.description} </p> <div class="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7"> ${renderComponent($$result, "Button", Button, { "variant": "secondary", "size": "sm", "rounded": "xl", "className": "px-4" }, { "default": ($$result2) => renderTemplate` <a${addAttribute(feature.link, "href")} class="flex items-center gap-2"> <span>Discuss Project</span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:arrow-up-right", "class": "size-4" })} </a> ` })} </div> </div> </div>`)} </div> </div> </div> </section>`;
}, "/Users/jdbohrman/www.runportcullis.co/src/components/sections/features.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$HeroLanding = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<section class="space-y-6 py-12 sm:py-20 lg:py-20"> <div class="container flex max-w-7xl flex-col items-center gap-5 text-center"> <a href="https://www.hackernews.com"', ' target="_blank"> <span class="mr-3">🎉</span> Introducing on Hackernews\n<svg class="ml-2 size-3.5" data-icon="ycombinator" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid"> <g> <rect fill="#FB651E" x="0" y="0" width="256" height="256"></rect> <path d="M119.373653,144.745813 L75.43296,62.4315733 L95.5144533,62.4315733 L121.36192,114.52416 C121.759575,115.452022 122.2235,116.413008 122.753707,117.407147 C123.283914,118.401285 123.747838,119.428546 124.145493,120.48896 C124.410597,120.886615 124.609422,121.251127 124.741973,121.582507 C124.874525,121.913886 125.007075,122.212123 125.139627,122.477227 C125.802386,123.802744 126.39886,125.095105 126.929067,126.354347 C127.459274,127.613589 127.923198,128.773399 128.320853,129.833813 C129.381268,127.580433 130.541078,125.1614 131.80032,122.57664 C133.059562,119.99188 134.351922,117.307747 135.67744,114.52416 L161.92256,62.4315733 L180.612267,62.4315733 L136.27392,145.739947 L136.27392,198.826667 L119.373653,198.826667 L119.373653,144.745813 Z" fill="#FFFFFF"></path> </g> </svg> </a> <h1 class="text-balance font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[66px]">\nThe navigational advisory for realtime data engineering\n</h1> <p class="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">\nWe provide steering assistance to companies looking to enhance their usage of realtime data warehouses\n</p> <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"> <a href="/pricing"', '> <span class="ml-2">See pricing</span> ', ` </a> </div> </div> </section> <script>
  document.addEventListener('DOMContentLoaded', () => {
    const heroIntercomButton = document.querySelector('[data-track="speak-with-us"]');
    if (heroIntercomButton) {
      heroIntercomButton.addEventListener('click', () => {
        analytics.track('Hero Intercom Button Clicked', { 
          location: 'Hero Section',
          buttonText: 'Get a free 1-week trial' 
        });
      });
    }
  });
<\/script>`])), maybeRenderHead(), addAttribute(cn(
    buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
    "px-4"
  ), "class"), addAttribute(cn(buttonVariants({ size: "lg", rounded: "full" }), "bg-black text-white hover:opacity-90 transition-all duration-300 shadow-md flex items-center justify-center"), "class"), renderComponent($$result, "Icon", $$Icon, { "name": "lucide:circle-arrow-right", "class": "ml-2 size-4" }));
}, "/Users/jdbohrman/www.runportcullis.co/src/components/sections/hero-landing.astro", void 0);
const $$Astro = createAstro("https://www.runportcullis.co");
const $$InfoLanding = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$InfoLanding;
  const { reverse, data } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="py-16 sm:py-20"> <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8"> <div${addAttribute(cn(reverse ? "lg:order-2" : "lg:order-1"), "class")}> <h2 class="font-heading text-3xl text-foreground md:text-4xl lg:text-[40px]"> ${data.title} </h2> <p class="mt-6 text-lg text-muted-foreground"> ${data.description} </p> <dl class="mt-6 space-y-4 leading-7"> ${data.list.map((item) => {
    return renderTemplate`<div class="relative pl-8"> <dt class="font-semibold"> ${renderComponent($$result, "Icon", $$Icon, { "name": item.icon, "class": "absolute left-0 top-1 size-5 stroke-purple-700" })} <span>${item.title}</span> </dt> <dd class="text-sm text-muted-foreground"> ${item.description} </dd> </div>`;
  })} </dl> </div> <div${addAttribute(cn(
    "rounded-xl overflow-hidden border lg:-m-4",
    reverse ? "order-1" : "order-2"
  ), "class")}> <img src="https://cdn.thenewstack.io/media/2023/07/aacdf144-image2.png"> </div> </div></div>`;
}, "/Users/jdbohrman/www.runportcullis.co/src/components/sections/info-landing.astro", void 0);
export {
  $$HeroLanding as $,
  $$InfoLanding as a,
  $$Features as b,
  infos as i
};
