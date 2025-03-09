import { customAlphabet, urlAlphabet } from "nanoid";
var generateSafeId = (defaultSize = 10) => customAlphabet(urlAlphabet, defaultSize)();
var NETLIFY_CACHE_BUST_PARAM = "__netlify_clerk_cache_bust";
export {
  NETLIFY_CACHE_BUST_PARAM as N,
  generateSafeId as g
};
