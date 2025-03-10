import { a as createComponent, c as createAstro, r as renderComponent, f as renderSlot, b as renderTemplate, g as defineScriptVars, d as addAttribute, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { a as cn, d as Button, $ as $$MainLayout } from "../chunks/main-layout_Dz18vA4v.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Bell, Database, FileText, Users, Settings, Clock, LineChart, PieChart, BarChart } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import "clsx";
import { g as generateSafeId } from "../chunks/chunk-MB6ONLJQ_BU_kMdek.mjs";
import { renderers } from "../renderers.mjs";
const BentoGrid = ({ children, className, ...props }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      ),
      ...props,
      children
    }
  );
};
const BentoCard = ({
  name,
  className,
  backgroundClass,
  iconName,
  description,
  href,
  cta,
  ...props
}) => {
  const renderIcon = () => {
    switch (iconName) {
      case "BarChart":
        return /* @__PURE__ */ jsx(BarChart, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "PieChart":
        return /* @__PURE__ */ jsx(PieChart, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "LineChart":
        return /* @__PURE__ */ jsx(LineChart, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "Clock":
        return /* @__PURE__ */ jsx(Clock, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "Settings":
        return /* @__PURE__ */ jsx(Settings, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "Users":
        return /* @__PURE__ */ jsx(Users, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "FileText":
        return /* @__PURE__ */ jsx(FileText, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "Database":
        return /* @__PURE__ */ jsx(Database, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      case "Bell":
        return /* @__PURE__ */ jsx(Bell, { className: "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" });
      default:
        return /* @__PURE__ */ jsx("div", { className: "h-12 w-12" });
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        // light styles
        "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("div", { className: cn("absolute inset-0", backgroundClass) }),
        /* @__PURE__ */ jsxs("div", { className: "pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10", children: [
          renderIcon(),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-neutral-700 dark:text-neutral-300", children: name }),
          /* @__PURE__ */ jsx("p", { className: "max-w-lg text-neutral-400", children: description })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            ),
            children: /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, size: "sm", className: "pointer-events-auto", children: /* @__PURE__ */ jsxs("a", { href, children: [
              cta,
              /* @__PURE__ */ jsx(ArrowRightIcon, { className: "ms-2 h-4 w-4 rtl:rotate-180" })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" })
      ]
    },
    name
  );
};
const Breadcrumb = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("nav", { ref, "aria-label": "breadcrumb", ...props }));
Breadcrumb.displayName = "Breadcrumb";
const BreadcrumbList = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "ol",
    {
      ref,
      className: cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className
      ),
      ...props
    }
  )
);
BreadcrumbList.displayName = "BreadcrumbList";
const BreadcrumbItem = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, className: cn("inline-flex items-center gap-1.5", className), ...props })
);
BreadcrumbItem.displayName = "BreadcrumbItem";
const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";
const BreadcrumbPage = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "span",
    {
      ref,
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("text-foreground", className),
      ...props
    }
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";
const BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ jsx("li", { role: "presentation", "aria-hidden": "true", className, ...props, children: children ?? /* @__PURE__ */ jsx(ChevronRightIcon, { size: 16, strokeWidth: 2 }) });
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
const $$Astro$7 = createAstro("https://www.runportcullis.co");
const $$SignedInCSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$SignedInCSR;
  const { class: className } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "clerk-signed-in", "clerk-signed-in", { "class": className, "hidden": true }, { "default": () => renderTemplate` ${renderSlot($$result, $$slots["default"])} ` })} `;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/control/SignedInCSR.astro", void 0);
const $$Astro$6 = createAstro("https://www.runportcullis.co");
const $$SignedInSSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$SignedInSSR;
  const { userId } = Astro2.locals.auth();
  return renderTemplate`${userId ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : null}`;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/control/SignedInSSR.astro", void 0);
const configOutput = "server";
function isStaticOutput(forceStatic) {
  if (forceStatic !== void 0) {
    return forceStatic;
  }
  return configOutput === "static";
}
const $$Astro$5 = createAstro("https://www.runportcullis.co");
const $$SignedIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SignedIn;
  const { isStatic, class: className } = Astro2.props;
  const SignedInComponent = isStaticOutput(isStatic) ? $$SignedInCSR : $$SignedInSSR;
  return renderTemplate`${renderComponent($$result, "SignedInComponent", SignedInComponent, { "class": className }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/control/SignedIn.astro", void 0);
const $$Astro$4 = createAstro("https://www.runportcullis.co");
const $$SignedOutCSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SignedOutCSR;
  const { class: className } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "clerk-signed-out", "clerk-signed-out", { "class": className, "hidden": true }, { "default": () => renderTemplate` ${renderSlot($$result, $$slots["default"])} ` })} `;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/control/SignedOutCSR.astro", void 0);
const $$Astro$3 = createAstro("https://www.runportcullis.co");
const $$SignedOutSSR = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SignedOutSSR;
  const { userId } = Astro2.locals.auth();
  return renderTemplate`${!userId ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : null}`;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/control/SignedOutSSR.astro", void 0);
const $$Astro$2 = createAstro("https://www.runportcullis.co");
const $$SignedOut = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SignedOut;
  const { isStatic, class: className } = Astro2.props;
  const SignedOutComponent = isStaticOutput(isStatic) ? $$SignedOutCSR : $$SignedOutSSR;
  return renderTemplate`${renderComponent($$result, "SignedOutComponent", SignedOutComponent, { "class": className }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/control/SignedOut.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://www.runportcullis.co");
const $$InternalUIComponentRenderer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$InternalUIComponentRenderer;
  const { component, id, ...props } = Astro2.props;
  const safeId = id || generateSafeId();
  return renderTemplate(_a || (_a = __template(["", "<div", "></div> <script>(function(){", "\n  /**\n   * Store the id and the props for the Astro component in order to mount the correct UI component once clerk is loaded.\n   * The above is handled by `mountAllClerkAstroJSComponents`.\n   */\n  const setOrCreatePropMap = ({ category, id, props }) => {\n    if (!window.__astro_clerk_component_props) {\n      window.__astro_clerk_component_props = new Map();\n    }\n\n    if (!window.__astro_clerk_component_props.has(category)) {\n      const _ = new Map();\n      _.set(id, props);\n      window.__astro_clerk_component_props.set(category, _);\n    }\n\n    window.__astro_clerk_component_props.get(category)?.set(id, props);\n  };\n\n  setOrCreatePropMap({\n    category: component,\n    id: `clerk-${component}-${safeId}`,\n    props,\n  });\n})();<\/script>"], ["", "<div", "></div> <script>(function(){", "\n  /**\n   * Store the id and the props for the Astro component in order to mount the correct UI component once clerk is loaded.\n   * The above is handled by \\`mountAllClerkAstroJSComponents\\`.\n   */\n  const setOrCreatePropMap = ({ category, id, props }) => {\n    if (!window.__astro_clerk_component_props) {\n      window.__astro_clerk_component_props = new Map();\n    }\n\n    if (!window.__astro_clerk_component_props.has(category)) {\n      const _ = new Map();\n      _.set(id, props);\n      window.__astro_clerk_component_props.set(category, _);\n    }\n\n    window.__astro_clerk_component_props.get(category)?.set(id, props);\n  };\n\n  setOrCreatePropMap({\n    category: component,\n    id: \\`clerk-\\${component}-\\${safeId}\\`,\n    props,\n  });\n})();<\/script>"])), maybeRenderHead(), addAttribute(`clerk-${component}-${safeId}`, "data-clerk-id"), defineScriptVars({ props, component, safeId }));
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/interactive/InternalUIComponentRenderer.astro", void 0);
const $$Astro = createAstro("https://www.runportcullis.co");
const $$SignIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignIn;
  return renderTemplate`${renderComponent($$result, "InternalUIComponentRenderer", $$InternalUIComponentRenderer, { ...Astro2.props, "component": "sign-in" })}`;
}, "/Users/jdbohrman/www.runportcullis.co/node_modules/.pnpm/@clerk+astro@2.3.2_astro@4.16.18_react-dom@18.3.1_react@18.3.1/node_modules/@clerk/astro/components/interactive/SignIn.astro", void 0);
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const dashboardItems = [
    {
      name: "Analytics Overview",
      className: "md:col-span-1",
      iconName: "BarChart",
      description: "View overall performance metrics and KPIs at a glance",
      href: "/analytics",
      cta: "View Analytics",
      backgroundClass: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30"
    },
    {
      name: "Recent Projects",
      className: "md:col-span-1",
      iconName: "FileText",
      description: "Access your most recent projects and activities",
      href: "/projects",
      cta: "See Projects",
      backgroundClass: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30"
    },
    {
      name: "Team Activity",
      className: "md:col-span-1",
      iconName: "Users",
      description: "Monitor your team's recent activities and contributions",
      href: "/team",
      cta: "View Team",
      backgroundClass: "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30"
    },
    {
      name: "Data Insights",
      className: "md:col-span-2",
      iconName: "PieChart",
      description: "Discover patterns and insights from your data with advanced visualizations",
      href: "/insights",
      cta: "Explore Insights",
      backgroundClass: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30"
    },
    {
      name: "Performance Metrics",
      className: "md:col-span-1",
      iconName: "LineChart",
      description: "Track key performance indicators over time",
      href: "/metrics",
      cta: "View Metrics",
      backgroundClass: "bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30"
    },
    {
      name: "System Status",
      className: "md:col-span-1",
      iconName: "Bell",
      description: "Check the health and status of your systems and services",
      href: "/status",
      cta: "View Status",
      backgroundClass: "bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/30 dark:to-cyan-950/30"
    },
    {
      name: "Database Management",
      className: "md:col-span-1",
      iconName: "Database",
      description: "Manage your database connections and monitor performance",
      href: "/database",
      cta: "Manage Databases",
      backgroundClass: "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-950/30"
    },
    {
      name: "Scheduled Tasks",
      className: "md:col-span-1",
      iconName: "Clock",
      description: "View and manage your scheduled tasks and automations",
      href: "/tasks",
      cta: "Manage Tasks",
      backgroundClass: "bg-gradient-to-br from-pink-50 to-fuchsia-100 dark:from-pink-950/30 dark:to-fuchsia-950/30"
    }
  ];
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24"> <div class="flex w-full flex-col gap-4 md:max-w-[58rem]"> ${renderComponent($$result2, "SignedIn", $$SignedIn, {}, { "default": ($$result3) => renderTemplate`  ${renderComponent($$result3, "Breadcrumb", Breadcrumb, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ui/breadcrumb", "client:component-export": "Breadcrumb" }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "BreadcrumbList", BreadcrumbList, {}, { "default": ($$result5) => renderTemplate` ${renderComponent($$result5, "BreadcrumbItem", BreadcrumbItem, {}, { "default": ($$result6) => renderTemplate` ${renderComponent($$result6, "BreadcrumbLink", BreadcrumbLink, { "href": "/" }, { "default": ($$result7) => renderTemplate`Home` })} ` })} ${renderComponent($$result5, "BreadcrumbSeparator", BreadcrumbSeparator, {})} ${renderComponent($$result5, "BreadcrumbItem", BreadcrumbItem, {}, { "default": ($$result6) => renderTemplate` ${renderComponent($$result6, "BreadcrumbPage", BreadcrumbPage, {}, { "default": ($$result7) => renderTemplate`Dashboard` })} ` })} ` })} ` })}  <div class="mb-8"> <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1> <p class="text-muted-foreground">
Welcome to your dashboard. Monitor performance, analyze data, and manage your projects.
</p> </div>  ${renderComponent($$result3, "BentoGrid", BentoGrid, { "className": "grid-cols-1 md:grid-cols-3", "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/magicui/bento-grid", "client:component-export": "BentoGrid" }, { "default": ($$result4) => renderTemplate`${dashboardItems.map((item) => renderTemplate`${renderComponent($$result4, "BentoCard", BentoCard, { "name": item.name, "className": item.className, "iconName": item.iconName, "description": item.description, "href": item.href, "cta": item.cta, "backgroundClass": item.backgroundClass, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/magicui/bento-grid", "client:component-export": "BentoCard" })}`)}` })} ` })} ${renderComponent($$result2, "SignedOut", $$SignedOut, {}, { "default": ($$result3) => renderTemplate` <div class="mx-auto flex w-full flex-col items-center justify-center gap-4 md:max-w-[58rem]"> ${renderComponent($$result3, "SignIn", $$SignIn, { "appearance": { elements: { footer: "hidden" } } })} </div> <p class="text-center text-sm text-muted-foreground">
Don't have an account? <a href="/pricing" class="text-black">Visit our pricing page</a> to get started.
</p> ` })} </div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/portal/index.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/portal/index.astro";
const $$url = "/portal";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
