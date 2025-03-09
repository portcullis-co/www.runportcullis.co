import { renderers } from "./renderers.mjs";
import { s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_DYQ_v7bF.mjs";
import { manifest } from "./manifest_DnzIaRMN.mjs";
import { createExports } from "@astrojs/netlify/ssr-function.js";
const _page0 = () => import("./pages/_image.astro.mjs");
const _page1 = () => import("./pages/api/assistant/connect.astro.mjs");
const _page2 = () => import("./pages/api/assistant/webhooks.astro.mjs");
const _page3 = () => import("./pages/api/clerk/webhooks.astro.mjs");
const _page4 = () => import("./pages/api/slack.astro.mjs");
const _page5 = () => import("./pages/api/stripe/webhooks.astro.mjs");
const _page6 = () => import("./pages/blog/category/_category_.astro.mjs");
const _page7 = () => import("./pages/blog.astro.mjs");
const _page8 = () => import("./pages/blog/_---slug_.astro.mjs");
const _page9 = () => import("./pages/cancel.astro.mjs");
const _page10 = () => import("./pages/contact.astro.mjs");
const _page11 = () => import("./pages/landing.astro.mjs");
const _page12 = () => import("./pages/legal/privacy.astro.mjs");
const _page13 = () => import("./pages/legal/terms.astro.mjs");
const _page14 = () => import("./pages/portal/messaging.astro.mjs");
const _page15 = () => import("./pages/portal/projects/reports.astro.mjs");
const _page16 = () => import("./pages/portal/projects.astro.mjs");
const _page17 = () => import("./pages/portal/settings/billing.astro.mjs");
const _page18 = () => import("./pages/portal/settings/preferences.astro.mjs");
const _page19 = () => import("./pages/portal/solutions/oss.astro.mjs");
const _page20 = () => import("./pages/portal/solutions/partnerts.astro.mjs");
const _page21 = () => import("./pages/portal/solutions.astro.mjs");
const _page22 = () => import("./pages/portal.astro.mjs");
const _page23 = () => import("./pages/pricing.astro.mjs");
const _page24 = () => import("./pages/releases/_slug_.astro.mjs");
const _page25 = () => import("./pages/releases.astro.mjs");
const _page26 = () => import("./pages/rss.xml.astro.mjs");
const _page27 = () => import("./pages/services/clickhouse-support.astro.mjs");
const _page28 = () => import("./pages/services/content-writing.astro.mjs");
const _page29 = () => import("./pages/services/custom-poc.astro.mjs");
const _page30 = () => import("./pages/services/project-planning.astro.mjs");
const _page31 = () => import("./pages/services/query-optimization.astro.mjs");
const _page32 = () => import("./pages/success.astro.mjs");
const _page33 = () => import("./pages/talk.astro.mjs");
const _page34 = () => import("./pages/utils/deeplinks.astro.mjs");
const _page35 = () => import("./pages/utils/stats_aggregator.astro.mjs");
const _page36 = () => import("./pages/index.astro.mjs");
const pageMap = /* @__PURE__ */ new Map([
  ["node_modules/.pnpm/astro@4.16.18_typescript@5.8.2/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
  ["src/pages/api/assistant/connect.ts", _page1],
  ["src/pages/api/assistant/webhooks.ts", _page2],
  ["src/pages/api/clerk/webhooks.ts", _page3],
  ["src/pages/api/slack.ts", _page4],
  ["src/pages/api/stripe/webhooks.ts", _page5],
  ["src/pages/blog/category/[category].astro", _page6],
  ["src/pages/blog/index.astro", _page7],
  ["src/pages/blog/[...slug].astro", _page8],
  ["src/pages/cancel.astro", _page9],
  ["src/pages/contact.astro", _page10],
  ["src/pages/landing.astro", _page11],
  ["src/pages/legal/privacy.md", _page12],
  ["src/pages/legal/terms.md", _page13],
  ["src/pages/portal/messaging/index.astro", _page14],
  ["src/pages/portal/projects/reports/index.astro", _page15],
  ["src/pages/portal/projects/index.astro", _page16],
  ["src/pages/portal/settings/billing/index.astro", _page17],
  ["src/pages/portal/settings/preferences/index.astro", _page18],
  ["src/pages/portal/solutions/oss/index.astro", _page19],
  ["src/pages/portal/solutions/partnerts/index.astro", _page20],
  ["src/pages/portal/solutions/index.astro", _page21],
  ["src/pages/portal/index.astro", _page22],
  ["src/pages/pricing.astro", _page23],
  ["src/pages/releases/[slug].astro", _page24],
  ["src/pages/releases/index.astro", _page25],
  ["src/pages/rss.xml.js", _page26],
  ["src/pages/services/clickhouse-support.astro", _page27],
  ["src/pages/services/content-writing.astro", _page28],
  ["src/pages/services/custom-poc.astro", _page29],
  ["src/pages/services/project-planning.astro", _page30],
  ["src/pages/services/query-optimization.astro", _page31],
  ["src/pages/success.astro", _page32],
  ["src/pages/talk.astro", _page33],
  ["src/pages/utils/deepLinks.ts", _page34],
  ["src/pages/utils/stats_aggregator.ts", _page35],
  ["src/pages/index.astro", _page36]
]);
const serverIslandMap = /* @__PURE__ */ new Map();
const _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  middleware: () => import("./_astro-internal_middleware.mjs")
});
const _args = {
  "middlewareSecret": "f5f137ab-3e17-4c4e-9206-52a10597d5ed"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = "start";
if (_start in serverEntrypointModule) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
