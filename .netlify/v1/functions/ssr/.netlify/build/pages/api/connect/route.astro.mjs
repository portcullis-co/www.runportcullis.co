import "../../../chunks/rtvi.config_HO4ZNCI7.mjs";
import { renderers } from "../../../renderers.mjs";
async function POST(request) {
  const { services, config, rtvi_client_version } = await request.json();
  {
    return new Response(`Services or config not found on request body`, {
      status: 400
    });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
