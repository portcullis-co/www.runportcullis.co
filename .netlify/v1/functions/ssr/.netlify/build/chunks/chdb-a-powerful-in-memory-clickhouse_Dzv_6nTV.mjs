async function getMod() {
  return import("./chdb-a-powerful-in-memory-clickhouse_C2i4ELYR.mjs");
}
const collectedLinks = [];
const collectedStyles = [];
const collectedScripts = [];
const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts };
export {
  defaultMod as default
};
