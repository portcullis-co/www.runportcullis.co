import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead, d as addAttribute, e as renderTransition, f as renderSlot } from '../../chunks/astro/server_DlAcna1r.mjs';
import { a as cn, b as buttonVariants, d as $$Icon, B as Badge, f as formatDate, $ as $$MainLayout } from '../../chunks/main-layout_CyfB8DwD.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_D9QlpF0I.mjs';
/* empty css                                         */
import { g as getCollection } from '../../chunks/_astro_content_CPjo0GXI.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://www.runportcullis.co");
const $$BlogPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const slug = Astro2.props.slug;
  const { title, description, pubDate, updatedDate, cover, category } = Astro2.props.data;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="relative container max-w-screen-md py-10"> <button onclick="history.back()"${addAttribute(cn(
    buttonVariants({ variant: "ghost" }),
    "absolute left-[-200px] top-10 hidden xl:inline-flex text-muted-foreground"
  ), "class")}${addAttribute(renderTransition($$result2, "ks7i2azy", "slide", ""), "data-astro-transition-scope")}> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:chevron-left", "class": "mr-2 size-4" })} ${" "}Back
</button> <article class="prose dark:prose-invert max-w-none"> <a${addAttribute(`/blog/category/${category}`, "href")}${addAttribute(renderTransition($$result2, "4rjw2hgd", "", `badge-cat-${slug}`), "data-astro-transition-scope")}> ${renderComponent($$result2, "Badge", Badge, { "radius": "md", "className": "capitalize" }, { "default": ($$result3) => renderTemplate`${category}` })} </a> ${renderComponent($$result2, "Image", $$Image, { "class": "rounded-xl overflow-hidden my-6", "width": 720, "height": 360, "src": cover, "alt": title, "data-astro-transition-scope": renderTransition($$result2, "3fmipmlo", "", `img-${slug}`) })} <div class="flex items-center justify-between"> <span class="font-medium text-muted-foreground"${addAttribute(renderTransition($$result2, "5hio3otc", "", `date-${slug}`), "data-astro-transition-scope")}> ${formatDate(pubDate)} ${updatedDate && renderTemplate`<span>- Last updated on ${formatDate(updatedDate)}</span>`} </span> </div> <h1 class="font-heading text-4xl my-4"${addAttribute(renderTransition($$result2, "3mzj52bz", "", `title-${slug}`), "data-astro-transition-scope")}> ${title} </h1> <p>${description}</p> <hr class="my-6"> ${renderSlot($$result2, $$slots["default"])} </article> </div> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/layouts/blog-post.astro", "self");

const $$Astro = createAstro("https://www.runportcullis.co");
async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const post = Astro2.props;
  const slug = Astro2.params.slug;
  const { Content } = await post.render();
  if (!slug || !post) {
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
  }
  return renderTemplate`${renderComponent($$result, "BlogPostLayout", $$BlogPost, { ...post }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})} ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/[...slug].astro", undefined);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/blog/[...slug].astro";
const $$url = "/blog/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
