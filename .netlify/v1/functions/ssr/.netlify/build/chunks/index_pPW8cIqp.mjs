import { _ as __astro_tag_component__, F as Fragment, n as createVNode } from './astro/server_DlAcna1r.mjs';
import { $ as $$Image } from './_astro_assets_D9QlpF0I.mjs';
import 'clsx';

const frontmatter = {
  "title": "Motivations",
  "description": "Why Portcullis become a thing"
};
function getHeadings() {
  return [];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    hr: "hr",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "In a landscape where data is the new oil, we wanted to build a tool that creates the refinery to extract value from data. - James"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "When we started Portcullis, we had a few goals in mind:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: createVNode(_components.strong, {
          children: "Build a data commerce portal that is easy to use and maintain."
        })
      }), "\n", createVNode(_components.li, {
        children: createVNode(_components.strong, {
          children: "Build a data commerce portal that is so flexible it can be used for applications even outside data sharing."
        })
      }), "\n", createVNode(_components.li, {
        children: createVNode(_components.strong, {
          children: "Provide users with a way to commercialize their data without having to commit a huge portion of their ACV to a data sharing platform."
        })
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "While Portcullis in many ways is a simple tool, the commercialization it enables and the flexibility it provides is what makes it so powerful. We also believe that the value compared to other alternatives is bar-none."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.p, {
      children: ["For more information, please visit our ", createVNode(_components.a, {
        href: "https://www.Portcullis.co",
        children: "website"
      }), " or contact us at ", createVNode(_components.a, {
        href: "mailto:support@Portcullis.com",
        children: "support@Portcullis.com"
      }), "."]
    })]
  });
}
function MDXContent(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
const url = "src/content/docs/documentation/index.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/index.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/index.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
