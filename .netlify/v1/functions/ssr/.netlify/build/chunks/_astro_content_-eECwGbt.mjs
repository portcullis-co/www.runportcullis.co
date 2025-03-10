import pLimit from "p-limit";
import { r as removeBase, i as isRemotePath, V as VALID_INPUT_FORMATS, A as AstroError, U as UnknownContentCollectionError, p as prependForwardSlash } from "./astro/assets-service_C8pWaI-5.mjs";
import { a as createComponent, h as renderUniqueStylesheet, i as renderScriptElement, j as createHeadAndContent, r as renderComponent, b as renderTemplate, u as unescapeHTML } from "./astro/server_aMtVhhw-.mjs";
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);
  for (let i2 = 0; i2 < arraybuffer.byteLength; i2++) {
    dv.setUint8(i2, binaryString.charCodeAt(i2));
  }
  return arraybuffer;
}
const KEY_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i2 = 0; i2 < data.length; i2++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i2]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 16711680) >> 16);
      output += String.fromCharCode((buffer & 65280) >> 8);
      output += String.fromCharCode(buffer & 255);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 65280) >> 8);
    output += String.fromCharCode(buffer & 255);
  }
  return output;
}
const UNDEFINED = -1;
const HOLE = -2;
const NAN = -3;
const POSITIVE_INFINITY = -4;
const NEGATIVE_INFINITY = -5;
const NEGATIVE_ZERO = -6;
function unflatten(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone) throw new Error(`Invalid input`);
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i2 = 1; i2 < value.length; i2 += 1) {
              set.add(hydrate(value[i2]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              map.set(hydrate(value[i2]), hydrate(value[i2 + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              obj[value[i2]] = hydrate(value[i2 + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            const TypedArrayConstructor = globalThis[type];
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            const typedArray = new TypedArrayConstructor(arraybuffer);
            hydrated[index] = typedArray;
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          const n2 = value[i2];
          if (n2 === HOLE) continue;
          array[i2] = hydrate(n2);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key in value) {
        const n2 = value[key];
        object[key] = hydrate(n2);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
var e = (e2) => Object.prototype.toString.call(e2), t = (e2) => ArrayBuffer.isView(e2) && !(e2 instanceof DataView), o = (t2) => "[object Date]" === e(t2), n = (t2) => "[object RegExp]" === e(t2), r = (t2) => "[object Error]" === e(t2), s = (t2) => "[object Boolean]" === e(t2), l = (t2) => "[object Number]" === e(t2), i = (t2) => "[object String]" === e(t2), c = Array.isArray, u = Object.getOwnPropertyDescriptor, a = Object.prototype.propertyIsEnumerable, f = Object.getOwnPropertySymbols, p = Object.prototype.hasOwnProperty, h = Object.keys;
function d(e2) {
  const t2 = h(e2), o2 = f(e2);
  for (let n2 = 0; n2 < o2.length; n2++) a.call(e2, o2[n2]) && t2.push(o2[n2]);
  return t2;
}
function b(e2, t2) {
  return !u(e2, t2)?.writable;
}
function y(e2, u2) {
  if ("object" == typeof e2 && null !== e2) {
    let a2;
    if (c(e2)) a2 = [];
    else if (o(e2)) a2 = new Date(e2.getTime ? e2.getTime() : e2);
    else if (n(e2)) a2 = new RegExp(e2);
    else if (r(e2)) a2 = { message: e2.message };
    else if (s(e2) || l(e2) || i(e2)) a2 = Object(e2);
    else {
      if (t(e2)) return e2.slice();
      a2 = Object.create(Object.getPrototypeOf(e2));
    }
    const f2 = u2.includeSymbols ? d : h;
    for (const t2 of f2(e2)) a2[t2] = e2[t2];
    return a2;
  }
  return e2;
}
var g = { includeSymbols: false, immutable: false };
function m(e2, t2, o2 = g) {
  const n2 = [], r2 = [];
  let s2 = true;
  const l2 = o2.includeSymbols ? d : h, i2 = !!o2.immutable;
  return function e3(u2) {
    const a2 = i2 ? y(u2, o2) : u2, f2 = {};
    let h2 = true;
    const d2 = { node: a2, node_: u2, path: [].concat(n2), parent: r2[r2.length - 1], parents: r2, key: n2[n2.length - 1], isRoot: 0 === n2.length, level: n2.length, circular: void 0, isLeaf: false, notLeaf: true, notRoot: true, isFirst: false, isLast: false, update: function(e4, t3 = false) {
      d2.isRoot || (d2.parent.node[d2.key] = e4), d2.node = e4, t3 && (h2 = false);
    }, delete: function(e4) {
      delete d2.parent.node[d2.key], e4 && (h2 = false);
    }, remove: function(e4) {
      c(d2.parent.node) ? d2.parent.node.splice(d2.key, 1) : delete d2.parent.node[d2.key], e4 && (h2 = false);
    }, keys: null, before: function(e4) {
      f2.before = e4;
    }, after: function(e4) {
      f2.after = e4;
    }, pre: function(e4) {
      f2.pre = e4;
    }, post: function(e4) {
      f2.post = e4;
    }, stop: function() {
      s2 = false;
    }, block: function() {
      h2 = false;
    } };
    if (!s2) return d2;
    function g2() {
      if ("object" == typeof d2.node && null !== d2.node) {
        d2.keys && d2.node_ === d2.node || (d2.keys = l2(d2.node)), d2.isLeaf = 0 === d2.keys.length;
        for (let e4 = 0; e4 < r2.length; e4++) if (r2[e4].node_ === u2) {
          d2.circular = r2[e4];
          break;
        }
      } else d2.isLeaf = true, d2.keys = null;
      d2.notLeaf = !d2.isLeaf, d2.notRoot = !d2.isRoot;
    }
    g2();
    const m2 = t2(d2, d2.node);
    if (void 0 !== m2 && d2.update && d2.update(m2), f2.before && f2.before(d2, d2.node), !h2) return d2;
    if ("object" == typeof d2.node && null !== d2.node && !d2.circular) {
      r2.push(d2), g2();
      for (const [t3, o3] of Object.entries(d2.keys ?? [])) {
        n2.push(o3), f2.pre && f2.pre(d2, d2.node[o3], o3);
        const r3 = e3(d2.node[o3]);
        i2 && p.call(d2.node, o3) && !b(d2.node, o3) && (d2.node[o3] = r3.node), r3.isLast = !!d2.keys?.length && +t3 == d2.keys.length - 1, r3.isFirst = 0 == +t3, f2.post && f2.post(d2, r3), n2.pop();
      }
      r2.pop();
    }
    return f2.after && f2.after(d2, d2.node), d2;
  }(e2).node;
}
var j = class {
  #e;
  #t;
  constructor(e2, t2 = g) {
    this.#e = e2, this.#t = t2;
  }
  get(e2) {
    let t2 = this.#e;
    for (let o2 = 0; t2 && o2 < e2.length; o2++) {
      const n2 = e2[o2];
      if (!p.call(t2, n2) || !this.#t.includeSymbols && "symbol" == typeof n2) return;
      t2 = t2[n2];
    }
    return t2;
  }
  has(e2) {
    let t2 = this.#e;
    for (let o2 = 0; t2 && o2 < e2.length; o2++) {
      const n2 = e2[o2];
      if (!p.call(t2, n2) || !this.#t.includeSymbols && "symbol" == typeof n2) return false;
      t2 = t2[n2];
    }
    return true;
  }
  set(e2, t2) {
    let o2 = this.#e, n2 = 0;
    for (n2 = 0; n2 < e2.length - 1; n2++) {
      const t3 = e2[n2];
      p.call(o2, t3) || (o2[t3] = {}), o2 = o2[t3];
    }
    return o2[e2[n2]] = t2, t2;
  }
  map(e2) {
    return m(this.#e, e2, { immutable: true, includeSymbols: !!this.#t.includeSymbols });
  }
  forEach(e2) {
    return this.#e = m(this.#e, e2, this.#t), this.#e;
  }
  reduce(e2, t2) {
    const o2 = 1 === arguments.length;
    let n2 = o2 ? this.#e : t2;
    return this.forEach((t3, r2) => {
      t3.isRoot && o2 || (n2 = e2(t3, n2, r2));
    }), n2;
  }
  paths() {
    const e2 = [];
    return this.forEach((t2) => {
      e2.push(t2.path);
    }), e2;
  }
  nodes() {
    const e2 = [];
    return this.forEach((t2) => {
      e2.push(t2.node);
    }), e2;
  }
  clone() {
    const e2 = [], o2 = [], n2 = this.#t;
    return t(this.#e) ? this.#e.slice() : function t2(r2) {
      for (let t3 = 0; t3 < e2.length; t3++) if (e2[t3] === r2) return o2[t3];
      if ("object" == typeof r2 && null !== r2) {
        const s2 = y(r2, n2);
        e2.push(r2), o2.push(s2);
        const l2 = n2.includeSymbols ? d : h;
        for (const e3 of l2(r2)) s2[e3] = t2(r2[e3]);
        return e2.pop(), o2.pop(), s2;
      }
      return r2;
    }(this.#e);
  }
};
const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1);
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}
class DataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import("./_astro_data-layer-content_B-2OIBLO.mjs");
      if (data.default instanceof Map) {
        return DataStore.fromMap(data.default);
      }
      const map = unflatten(data.default);
      return DataStore.fromMap(map);
    } catch {
    }
    return new DataStore();
  }
  static async fromMap(data) {
    const store = new DataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = DataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();
const __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_test_d2VsY29tZWQtYm94ZXItNTMuY2xlcmsuYWNjb3VudHMuZGV2JA", "PUBLIC_DAILY_ROOM_URL": "https://runportcullis.daily.co/catbox", "PUBLIC_PIPECAT_API_URL": "https://www.runportcullis.co/api", "PUBLIC_SITE_URL": "https://www.runportcullis.co", "SITE": "https://www.runportcullis.co", "SSR": true };
function createCollectionToGlobResultMap({
  globResult,
  contentDir: contentDir2
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir2}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap: contentCollectionToEntryMap2,
  dataCollectionToEntryMap: dataCollectionToEntryMap2,
  getRenderEntryImport,
  cacheEntriesByCollection: cacheEntriesByCollection2
}) {
  return async function getCollection2(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap2) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap2) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import("./_astro_asset-imports_DSNGcCXS.mjs");
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap2[collection] : dataCollectionToEntryMap2[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, {})?.DEV && cacheEntriesByCollection2.has(collection)) {
      entries = cacheEntriesByCollection2.get(collection);
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
      cacheEntriesByCollection2.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new j(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
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
const contentDir = "/src/content/";
const contentEntryGlob = /* @__PURE__ */ Object.assign({ "/src/content/blog/2025-clickhouse-support-report.md": () => import("./2025-clickhouse-support-report_CDSibWsY.mjs"), "/src/content/blog/building-a-vintage-recommendation-engine-part-1.md": () => import("./building-a-vintage-recommendation-engine-part-1_D9vZ2ZzG.mjs"), "/src/content/blog/bulk-data-clickhouse.md": () => import("./bulk-data-clickhouse_DwgPBLTp.mjs"), "/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md": () => import("./chdb-a-powerful-in-memory-clickhouse_YJQKc_o0.mjs"), "/src/content/blog/clickhouse-2025-roadmap.md": () => import("./clickhouse-2025-roadmap_jxxwOeDp.mjs"), "/src/content/blog/clickhouse-use-case-guide-digital-twins.md": () => import("./clickhouse-use-case-guide-digital-twins_DDrDX8Gc.mjs"), "/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md": () => import("./faster-clickhouse-queries-with-these-eight-tricks_3eQ8-2fl.mjs"), "/src/content/blog/how-we-power-our-free-trial.md": () => import("./how-we-power-our-free-trial_93kGjVuz.mjs"), "/src/content/blog/primary-key-caching.md": () => import("./primary-key-caching_BjOdenqk.mjs"), "/src/content/blog/setting-custom-http-headers.md": () => import("./setting-custom-http-headers_5Y-KUbtX.mjs"), "/src/content/blog/use-cases-for-clickhouse-json.md": () => import("./use-cases-for-clickhouse-json_D5aGlpl3.mjs"), "/src/content/blog/why-we-bet-on-clickhouse.md": () => import("./why-we-bet-on-clickhouse_g0IvZ9B2.mjs"), "/src/content/docs/documentation/code-blocks.mdx": () => import("./code-blocks_Ckiwna6-.mjs"), "/src/content/docs/documentation/commerce/data-fulfillment.mdx": () => import("./data-fulfillment_BN5wl1Jm.mjs"), "/src/content/docs/documentation/commerce/payment-links.mdx": () => import("./payment-links_czeS6hMA.mjs"), "/src/content/docs/documentation/commerce/portals.mdx": () => import("./portals_jR1jqrpM.mjs"), "/src/content/docs/documentation/commerce/stripe-connect.mdx": () => import("./stripe-connect_CDk3lsi4.mjs"), "/src/content/docs/documentation/concepts.mdx": () => import("./concepts_1umMpjxX.mjs"), "/src/content/docs/documentation/index.mdx": () => import("./index_CVprm1h2.mjs"), "/src/content/docs/documentation/style-guide.mdx": () => import("./style-guide_Bfi50WGi.mjs"), "/src/content/docs/getting-started.mdx": () => import("./getting-started_CuPfI4qy.mjs"), "/src/content/docs/in-progress.mdx": () => import("./in-progress_rtoO7je3.mjs") });
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
  globResult: contentEntryGlob,
  contentDir
});
const dataEntryGlob = /* @__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
  globResult: dataEntryGlob,
  contentDir
});
createCollectionToGlobResultMap({
  globResult: { ...contentEntryGlob, ...dataEntryGlob },
  contentDir
});
let lookupMap = {};
lookupMap = { "blog": { "type": "content", "entries": { "2025-clickhouse-support-report": "/src/content/blog/2025-clickhouse-support-report.md", "bulk-data-clickhouse": "/src/content/blog/bulk-data-clickhouse.md", "clickhouse-2025-roadmap": "/src/content/blog/clickhouse-2025-roadmap.md", "building-a-vintage-recommendation-engine-part-1": "/src/content/blog/building-a-vintage-recommendation-engine-part-1.md", "faster-clickhouse-queries-with-these-eight-tricks": "/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md", "chdb-a-powerful-in-memory-clickhouse": "/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md", "clickhouse-use-case-guide-digital-twins": "/src/content/blog/clickhouse-use-case-guide-digital-twins.md", "setting-custom-http-headers": "/src/content/blog/setting-custom-http-headers.md", "how-we-power-our-free-trial": "/src/content/blog/how-we-power-our-free-trial.md", "primary-key-caching": "/src/content/blog/primary-key-caching.md", "use-cases-for-clickhouse-json": "/src/content/blog/use-cases-for-clickhouse-json.md", "why-we-bet-on-clickhouse": "/src/content/blog/why-we-bet-on-clickhouse.md" } }, "docs": { "type": "content", "entries": { "getting-started": "/src/content/docs/getting-started.mdx", "in-progress": "/src/content/docs/in-progress.mdx", "documentation/code-blocks": "/src/content/docs/documentation/code-blocks.mdx", "documentation/concepts": "/src/content/docs/documentation/concepts.mdx", "documentation": "/src/content/docs/documentation/index.mdx", "documentation/style-guide": "/src/content/docs/documentation/style-guide.mdx", "documentation/commerce/payment-links": "/src/content/docs/documentation/commerce/payment-links.mdx", "documentation/commerce/data-fulfillment": "/src/content/docs/documentation/commerce/data-fulfillment.mdx", "documentation/commerce/portals": "/src/content/docs/documentation/commerce/portals.mdx", "documentation/commerce/stripe-connect": "/src/content/docs/documentation/commerce/stripe-connect.mdx" } } };
new Set(Object.keys(lookupMap));
function createGlobLookup(glob) {
  return async (collection, lookupId) => {
    const filePath = lookupMap[collection]?.entries[lookupId];
    if (!filePath) return void 0;
    return glob[collection][filePath];
  };
}
const renderEntryGlob = /* @__PURE__ */ Object.assign({ "/src/content/blog/2025-clickhouse-support-report.md": () => import("./2025-clickhouse-support-report_D_32q3gT.mjs"), "/src/content/blog/building-a-vintage-recommendation-engine-part-1.md": () => import("./building-a-vintage-recommendation-engine-part-1_BeWB_BA5.mjs"), "/src/content/blog/bulk-data-clickhouse.md": () => import("./bulk-data-clickhouse_CtMth5Ko.mjs"), "/src/content/blog/chdb-a-powerful-in-memory-clickhouse.md": () => import("./chdb-a-powerful-in-memory-clickhouse_Dzv_6nTV.mjs"), "/src/content/blog/clickhouse-2025-roadmap.md": () => import("./clickhouse-2025-roadmap_CU3b5iG6.mjs"), "/src/content/blog/clickhouse-use-case-guide-digital-twins.md": () => import("./clickhouse-use-case-guide-digital-twins_Cr6JqV-8.mjs"), "/src/content/blog/faster-clickhouse-queries-with-these-eight-tricks.md": () => import("./faster-clickhouse-queries-with-these-eight-tricks_DkMLs5UY.mjs"), "/src/content/blog/how-we-power-our-free-trial.md": () => import("./how-we-power-our-free-trial_DR-r2HP8.mjs"), "/src/content/blog/primary-key-caching.md": () => import("./primary-key-caching_B4G9OEzY.mjs"), "/src/content/blog/setting-custom-http-headers.md": () => import("./setting-custom-http-headers_D-kwaqZW.mjs"), "/src/content/blog/use-cases-for-clickhouse-json.md": () => import("./use-cases-for-clickhouse-json_dzc2cPa2.mjs"), "/src/content/blog/why-we-bet-on-clickhouse.md": () => import("./why-we-bet-on-clickhouse_DZnEX2eF.mjs"), "/src/content/docs/documentation/code-blocks.mdx": () => import("./code-blocks_BBwDYMu3.mjs"), "/src/content/docs/documentation/commerce/data-fulfillment.mdx": () => import("./data-fulfillment_XnJ_d_vf.mjs"), "/src/content/docs/documentation/commerce/payment-links.mdx": () => import("./payment-links_BTqQnOBy.mjs"), "/src/content/docs/documentation/commerce/portals.mdx": () => import("./portals_ChXbvDIj.mjs"), "/src/content/docs/documentation/commerce/stripe-connect.mdx": () => import("./stripe-connect_DgiULmES.mjs"), "/src/content/docs/documentation/concepts.mdx": () => import("./concepts_DiWvNaWp.mjs"), "/src/content/docs/documentation/index.mdx": () => import("./index_t266xCty.mjs"), "/src/content/docs/documentation/style-guide.mdx": () => import("./style-guide_3j3JCKmp.mjs"), "/src/content/docs/getting-started.mdx": () => import("./getting-started_Btk-tOIF.mjs"), "/src/content/docs/in-progress.mdx": () => import("./in-progress_B8B3w6aP.mjs") });
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
  globResult: renderEntryGlob,
  contentDir
});
const cacheEntriesByCollection = /* @__PURE__ */ new Map();
const getCollection = createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
  cacheEntriesByCollection
});
export {
  getCollection as g
};
