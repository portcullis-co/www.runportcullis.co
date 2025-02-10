import { n as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_Dkj-vugl.mjs';
import { $ as $$Image } from './_astro_assets_DoAXWItE.mjs';
import 'clsx';

const frontmatter = {
  "title": "Portals",
  "description": "About Portals"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "what-are-portals",
    "text": "What are Portals?"
  }, {
    "depth": 2,
    "slug": "how-portals-work",
    "text": "How Portals Work"
  }, {
    "depth": 3,
    "slug": "customization",
    "text": "Customization"
  }, {
    "depth": 3,
    "slug": "isolation",
    "text": "Isolation"
  }, {
    "depth": 2,
    "slug": "benefits-of-portals",
    "text": "Benefits of Portals"
  }, {
    "depth": 3,
    "slug": "flexibility",
    "text": "Flexibility"
  }, {
    "depth": 3,
    "slug": "ease-of-integration",
    "text": "Ease of Integration"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    h3: "h3",
    p: "p",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Portals are one of the main features of Portcullis. They enable the layered paywall which powers the flexibility of the platform."
    }), "\n", createVNode(_components.h2, {
      id: "what-are-portals",
      children: "What are Portals?"
    }), "\n", createVNode(_components.p, {
      children: "Portals are stacked embeds created of your content that create a gate for your content that can be tailored to fit the specific needs of different users and applications, providing a flexible and powerful paywall solution."
    }), "\n", createVNode(_components.h2, {
      id: "how-portals-work",
      children: "How Portals Work"
    }), "\n", createVNode(_components.h3, {
      id: "customization",
      children: "Customization"
    }), "\n", createVNode(_components.p, {
      children: "Portals can be endlessly customized to meet the unique requirements of different users. This includes custom branding, layouts, and functionalities. Whether you need a simple Coda produce or a Hex paywall, Portcullis portals can be adapted to suit your needs."
    }), "\n", createVNode(_components.h3, {
      id: "isolation",
      children: "Isolation"
    }), "\n", createVNode(_components.p, {
      children: "Each portal operates as an independent web page within the main Portcullis interface. This isolation ensures that data and code from one portal do not interfere with others. This is crucial for maintaining the integrity of your data and ensuring that each portal operates independently."
    }), "\n", createVNode(_components.h2, {
      id: "benefits-of-portals",
      children: "Benefits of Portals"
    }), "\n", createVNode(_components.h3, {
      id: "flexibility",
      children: "Flexibility"
    }), "\n", createVNode(_components.p, {
      children: "The ability to customize portals allows for a wide range of applications and use cases. Whether you\u2019re a small business owner or a large enterprise, Portcullis portals can be tailored to meet your specific needs."
    }), "\n", createVNode(_components.h3, {
      id: "ease-of-integration",
      children: "Ease of Integration"
    }), "\n", createVNode(_components.p, {
      children: "Portals can easily integrate with existing web applications, making it simple to add paywall capabilities to your current systems. This seamless integration ensures that you can start gating content quickly and efficiently."
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
const url = "src/content/docs/documentation/commerce/portals.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/portals.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/portals.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
