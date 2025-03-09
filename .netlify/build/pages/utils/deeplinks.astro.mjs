import { renderers } from "../../renderers.mjs";
function createMessageDeepLink(params) {
  const { teamId, channelId, messageTs } = params;
  return `slack://app?team=${teamId}&channel=${channelId}&message_ts=${messageTs}`;
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createMessageDeepLink
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
