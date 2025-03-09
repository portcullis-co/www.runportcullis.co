async function getMod() {
  return import("./faster-clickhouse-queries-with-these-eight-tricks_CYPkusaE.mjs");
}
const collectedLinks = [];
const collectedStyles = [];
const collectedScripts = [];
const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };
export {
  defaultMod as default
};
