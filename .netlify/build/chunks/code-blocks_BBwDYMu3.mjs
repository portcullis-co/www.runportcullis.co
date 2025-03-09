async function getMod() {
  return import("./code-blocks_Ce4mJVTl.mjs");
}
const collectedLinks = [];
const collectedStyles = [];
const collectedScripts = [];
const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };
export {
  defaultMod as default
};
