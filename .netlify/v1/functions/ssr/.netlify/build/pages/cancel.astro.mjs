import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from "../chunks/astro/server_aMtVhhw-.mjs";
import { $ as $$MainLayout } from "../chunks/main-layout_C4s2EEtb.mjs";
import { renderers } from "../renderers.mjs";
const $$Astro = createAstro("https://www.runportcullis.co");
const $$Cancel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cancel;
  const { searchParams } = Astro2.url;
  const userId = searchParams.get("user_id");
  const threadTs = searchParams.get("thread_ts");
  const slackDeepLink = `https://slack.com/app_redirect?channel=${userId}&message_ts=${threadTs}`;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Payment Cancelled", "description": "Your payment was cancelled. Return to Slack to try again.", "mainClass": "container max-w-3xl py-10" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col items-center justify-center text-center space-y-8"> <div class="space-y-3"> <h1 class="text-4xl font-bold tracking-tighter">Payment Cancelled</h1> <p class="text-muted-foreground">
Your payment was cancelled. No charges were made.
</p> </div> <div class="space-y-4"> <a${addAttribute(slackDeepLink, "href")} class="btn btn-lg btn-secondary">
Return to Conversation
</a> <p class="text-sm text-muted-foreground">
You'll be redirected back to your Slack conversation
</p> </div> </div> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/cancel.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/cancel.astro";
const $$url = "/cancel";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Cancel,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
