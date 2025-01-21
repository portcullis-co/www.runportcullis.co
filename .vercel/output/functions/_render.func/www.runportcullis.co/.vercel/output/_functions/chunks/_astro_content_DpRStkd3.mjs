import pLimit from 'p-limit';
import { A as AstroError, Z as UnknownContentCollectionError, x as prependForwardSlash } from './astro/assets-service_CrVA10mL.mjs';
import { s as createComponent, G as renderUniqueStylesheet, H as renderScriptElement, I as createHeadAndContent, t as renderTemplate, u as renderComponent, C as unescapeHTML } from './astro/server_C2DrDyYu.mjs';

function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign({"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": "https://www.runportcullis.co", "ASSETS_PREFIX": undefined}, {})?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (typeof filter === "function") {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md": () => import('./chdb-a-powerful-in-memory-clickhouse_DbPVXkB5.mjs'),"/src/content/blog/clickhouse-2025-roadmap.md": () => import('./clickhouse-2025-roadmap_C3B18mTL.mjs'),"/src/content/blog/clickhouse-use-case-guide-digital-twins.md": () => import('./clickhouse-use-case-guide-digital-twins_BJ1tS8wH.mjs'),"/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md": () => import('./faster-clickhouse-queries-with-these-eight-tricks_DJRze0bD.mjs'),"/src/content/blog/primary-key-caching.md": () => import('./primary-key-caching_B5ZE_Dxn.mjs'),"/src/content/blog/setting-custom-http-headers.md": () => import('./setting-custom-http-headers_CxgiMMFh.mjs'),"/src/content/blog/use-cases-for-clickhouse-json.md": () => import('./use-cases-for-clickhouse-json_DD8Hde--.mjs'),"/src/content/blog/why-we-bet-on-clickhouse.md": () => import('./why-we-bet-on-clickhouse_EFfn2DwB.mjs'),"/src/content/docs/documentation/code-blocks.mdx": () => import('./code-blocks_C8X8lkGN.mjs'),"/src/content/docs/documentation/commerce/data-fulfillment.mdx": () => import('./data-fulfillment_Bo2cooMn.mjs'),"/src/content/docs/documentation/commerce/payment-links.mdx": () => import('./payment-links_BrZ8Ffxi.mjs'),"/src/content/docs/documentation/commerce/portals.mdx": () => import('./portals_5nfAIyF9.mjs'),"/src/content/docs/documentation/commerce/stripe-connect.mdx": () => import('./stripe-connect_BvUZadKk.mjs'),"/src/content/docs/documentation/concepts.mdx": () => import('./concepts_DNnbkV-7.mjs'),"/src/content/docs/documentation/index.mdx": () => import('./index_DGAuQEY5.mjs'),"/src/content/docs/documentation/style-guide.mdx": () => import('./style-guide_T9wS3SHm.mjs'),"/src/content/docs/getting-started.mdx": () => import('./getting-started_pz39Kvzg.mjs'),"/src/content/docs/in-progress.mdx": () => import('./in-progress_DcFhl0mJ.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"blog":{"type":"content","entries":{"chdb-a-powerful-in-memory-clickhouse":"/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md","faster-clickhouse-queries-with-these-eight-tricks":"/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md","use-cases-for-clickhouse-json":"/src/content/blog/use-cases-for-clickhouse-json.md","clickhouse-2025-roadmap":"/src/content/blog/clickhouse-2025-roadmap.md","why-we-bet-on-clickhouse":"/src/content/blog/why-we-bet-on-clickhouse.md","clickhouse-use-case-guide-digital-twins":"/src/content/blog/clickhouse-use-case-guide-digital-twins.md","primary-key-caching":"/src/content/blog/primary-key-caching.md","setting-custom-http-headers":"/src/content/blog/setting-custom-http-headers.md"}},"docs":{"type":"content","entries":{"in-progress":"/src/content/docs/in-progress.mdx","getting-started":"/src/content/docs/getting-started.mdx","documentation/code-blocks":"/src/content/docs/documentation/code-blocks.mdx","documentation/concepts":"/src/content/docs/documentation/concepts.mdx","documentation":"/src/content/docs/documentation/index.mdx","documentation/style-guide":"/src/content/docs/documentation/style-guide.mdx","documentation/commerce/data-fulfillment":"/src/content/docs/documentation/commerce/data-fulfillment.mdx","documentation/commerce/payment-links":"/src/content/docs/documentation/commerce/payment-links.mdx","documentation/commerce/portals":"/src/content/docs/documentation/commerce/portals.mdx","documentation/commerce/stripe-connect":"/src/content/docs/documentation/commerce/stripe-connect.mdx"}}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md": () => import('./chdb-a-powerful-in-memory-clickhouse_DAHRVkq3.mjs'),"/src/content/blog/clickhouse-2025-roadmap.md": () => import('./clickhouse-2025-roadmap_C6jhsEJX.mjs'),"/src/content/blog/clickhouse-use-case-guide-digital-twins.md": () => import('./clickhouse-use-case-guide-digital-twins_VZwjXBf2.mjs'),"/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md": () => import('./faster-clickhouse-queries-with-these-eight-tricks_B587QIE_.mjs'),"/src/content/blog/primary-key-caching.md": () => import('./primary-key-caching_0nlt6Wc-.mjs'),"/src/content/blog/setting-custom-http-headers.md": () => import('./setting-custom-http-headers_CXIKXj2u.mjs'),"/src/content/blog/use-cases-for-clickhouse-json.md": () => import('./use-cases-for-clickhouse-json_B5z24b_1.mjs'),"/src/content/blog/why-we-bet-on-clickhouse.md": () => import('./why-we-bet-on-clickhouse_CvaYMIEH.mjs'),"/src/content/docs/documentation/code-blocks.mdx": () => import('./code-blocks_CchlCPi7.mjs'),"/src/content/docs/documentation/commerce/data-fulfillment.mdx": () => import('./data-fulfillment_BhR1yYxg.mjs'),"/src/content/docs/documentation/commerce/payment-links.mdx": () => import('./payment-links_B_do5xDn.mjs'),"/src/content/docs/documentation/commerce/portals.mdx": () => import('./portals_CAQViyYZ.mjs'),"/src/content/docs/documentation/commerce/stripe-connect.mdx": () => import('./stripe-connect_DIHv_sx_.mjs'),"/src/content/docs/documentation/concepts.mdx": () => import('./concepts_CNeuGy_R.mjs'),"/src/content/docs/documentation/index.mdx": () => import('./index_DVTgoFB6.mjs'),"/src/content/docs/documentation/style-guide.mdx": () => import('./style-guide_C02QUv9H.mjs'),"/src/content/docs/getting-started.mdx": () => import('./getting-started_DZ68ee_b.mjs'),"/src/content/docs/in-progress.mdx": () => import('./in-progress_BLsH9pR0.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
