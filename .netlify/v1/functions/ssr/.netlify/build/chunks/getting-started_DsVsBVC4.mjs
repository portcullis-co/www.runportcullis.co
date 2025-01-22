import { _ as __astro_tag_component__, F as Fragment, n as createVNode } from './astro/server_DlAcna1r.mjs';
import { $ as $$Image } from './_astro_assets_D9QlpF0I.mjs';
import 'clsx';

const frontmatter = {
  "title": "Getting started",
  "description": "Welcome to the Portcullis documentation."
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "concepts",
    "text": "Concepts"
  }, {
    "depth": 3,
    "slug": "portals",
    "text": "Portals"
  }, {
    "depth": 3,
    "slug": "commerce",
    "text": "Commerce"
  }, {
    "depth": 3,
    "slug": "architecture",
    "text": "Architecture"
  }, {
    "depth": 3,
    "slug": "motivations",
    "text": "Motivations"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
      h2: "h2",
      h3: "h3",
      p: "p",
      ...props.components
    },
    {
      Card
    } = _components;
  if (!Card) _missingMdxReference("Card");
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "This is the documentation site for Portcullis, the universal paywall for indie makers and ceiling breakers. In here you\u2019ll find information about how to get started with Portcullis, and the concepts behind the platform such as creating a merchant account, Portals, and the architecture of the platform."
    }), "\n", createVNode("br", {}), "\n", createVNode("div", {
      style: "position: relative; padding-bottom: calc(51.36054421768708% + 41px); height: 0; width: 100%;",
      children: createVNode("iframe", {
        src: "https://demo.arcade.software/SWLUeqXYA0BvNuKvSnoc?embed&show_copy_link=true",
        title: "localhost:3000/home",
        frameborder: "0",
        loading: "lazy",
        allowfullscreen: true,
        allow: "clipboard-write",
        style: "position: absolute; top: 0; left: 0; width: 100%; height: 100%;color-scheme: light;"
      })
    }), "\n", createVNode(_components.h2, {
      id: "concepts",
      children: "Concepts"
    }), "\n", createVNode(_components.p, {
      children: "Select a feature below to learn more about it."
    }), "\n", createVNode("div", {
      className: "docs-grid-cols-2 mt-6",
      children: [createVNode(Card, {
        href: "/docs/documentation/commerce/portals",
        children: [createVNode(_components.h3, {
          id: "portals",
          children: "Portals"
        }), createVNode(_components.p, {
          children: "The infinitely flexible data sharing portals of Portcullis"
        })]
      }), createVNode(Card, {
        href: "/docs/documentation/commerce/stripe-connect",
        children: [createVNode(_components.h3, {
          id: "commerce",
          children: "Commerce"
        }), createVNode(_components.p, {
          children: "The data commercialization layer that allows you to monetize your data."
        })]
      }), createVNode(Card, {
        href: "/docs/documentation/architecture",
        children: [createVNode(_components.h3, {
          id: "architecture",
          children: "Architecture"
        }), createVNode(_components.p, {
          children: "The architecture of Portcullis\u2019s simple but powerful data sharing."
        })]
      }), createVNode(Card, {
        href: "/docs/documentation/",
        disabled: true,
        children: [createVNode(_components.h3, {
          id: "motivations",
          children: "Motivations"
        }), createVNode(_components.p, {
          children: "The reasionings behind the platform."
        })]
      })]
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
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
const url = "src/content/docs/getting-started.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/getting-started.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/getting-started.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
