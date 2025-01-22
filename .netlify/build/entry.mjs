import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_Cxk7Kuzz.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/invite.astro.mjs');
const _page2 = () => import('./pages/blog/category/_category_.astro.mjs');
const _page3 = () => import('./pages/blog.astro.mjs');
const _page4 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page5 = () => import('./pages/contact.astro.mjs');
const _page6 = () => import('./pages/landing.astro.mjs');
const _page7 = () => import('./pages/legal/privacy.astro.mjs');
const _page8 = () => import('./pages/legal/terms.astro.mjs');
const _page9 = () => import('./pages/pricing.astro.mjs');
const _page10 = () => import('./pages/referral.astro.mjs');
const _page11 = () => import('./pages/releases/_slug_.astro.mjs');
const _page12 = () => import('./pages/releases.astro.mjs');
const _page13 = () => import('./pages/rss.xml.astro.mjs');
const _page14 = () => import('./pages/services/clickhouse-support.astro.mjs');
const _page15 = () => import('./pages/services/content-writing.astro.mjs');
const _page16 = () => import('./pages/services/custom-poc.astro.mjs');
const _page17 = () => import('./pages/services/oss-support.astro.mjs');
const _page18 = () => import('./pages/services/query-optimization.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.16.18_@types+node@22.10.7_rollup@4.31.0_typescript@5.7.3/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/invite.ts", _page1],
    ["src/pages/blog/category/[category].astro", _page2],
    ["src/pages/blog/index.astro", _page3],
    ["src/pages/blog/[...slug].astro", _page4],
    ["src/pages/contact.astro", _page5],
    ["src/pages/landing.astro", _page6],
    ["src/pages/legal/privacy.md", _page7],
    ["src/pages/legal/terms.md", _page8],
    ["src/pages/pricing.astro", _page9],
    ["src/pages/referral.astro", _page10],
    ["src/pages/releases/[slug].astro", _page11],
    ["src/pages/releases/index.astro", _page12],
    ["src/pages/rss.xml.js", _page13],
    ["src/pages/services/clickhouse-support.astro", _page14],
    ["src/pages/services/content-writing.astro", _page15],
    ["src/pages/services/custom-poc.astro", _page16],
    ["src/pages/services/oss-support.astro", _page17],
    ["src/pages/services/query-optimization.astro", _page18],
    ["src/pages/index.astro", _page19]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "3f257f5c-d3ba-4feb-8b9f-3b7c4ccb3cfb"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
