import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$MainLayout } from "../chunks/main-layout_BsXR2W6X.mjs";
/* empty css                                   */
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro("https://www.runportcullis.co");
const $$Success = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Success;
  const { searchParams } = Astro2.url;
  const email = searchParams.get("email");
  const inviteId = searchParams.get("invite_id");
  searchParams.get("channel_id");
  const isInitialLoad = !inviteId;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Setting Up Your Workspace", "description": "We're getting your Slack workspace connected", "mainClass": "container max-w-3xl py-10", "data-astro-cid-5y44lzmc": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col items-center justify-center text-center space-y-8" data-astro-cid-5y44lzmc> <div class="space-y-3" data-astro-cid-5y44lzmc> <h1 class="text-4xl font-bold tracking-tighter" data-astro-cid-5y44lzmc> ${isInitialLoad ? "Setting Up Your Workspace..." : "Workspace Connected!"} </h1> <p class="text-muted-foreground" data-astro-cid-5y44lzmc> ${isInitialLoad ? "We're creating your secure channel and sending your invitation..." : "Check your email for the Slack Connect invitation"} </p> </div> <div class="space-y-4" id="status-container" data-astro-cid-5y44lzmc> ${isInitialLoad && email ? renderTemplate`<div class="loading-spinner" data-astro-cid-5y44lzmc>Setting up...</div>` : renderTemplate`<div class="space-y-4" data-astro-cid-5y44lzmc> <p class="text-green-600 font-medium" data-astro-cid-5y44lzmc>✓ Invitation sent successfully</p> <p class="text-sm text-muted-foreground" data-astro-cid-5y44lzmc>
Click the link in your email to join the Slack channel
</p> </div>`} </div> </div> ` })} `;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/success.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/success.astro";
const $$url = "/success";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
