import { _ as __astro_tag_component__, F as Fragment, p as createVNode } from './astro/server_C2DrDyYu.mjs';
import { $ as $$Image } from './_astro_assets_DCrfm02W.mjs';
import 'clsx';

const frontmatter = {
  "title": "Data Fulfillment",
  "description": "How to fulfill data requests"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "steps-to-fulfill-data-requests",
    "text": "Steps to Fulfill Data Requests"
  }, {
    "depth": 3,
    "slug": "1-receive-payment",
    "text": "1. Receive Payment"
  }, {
    "depth": 3,
    "slug": "2-generate-data-access-link",
    "text": "2. Generate Data Access Link"
  }, {
    "depth": 3,
    "slug": "3-email-the-endpoint-to-the-customer",
    "text": "3. Email the endpoint to the Customer"
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
      children: "This is the fun part! Once you\u2019ve received a payment for a data product, you get to fulfill the request! As of this writing, we have not currently set up a method to automate the process of exposing or emailing a link to your preferred Semantic Layer endpoint to your customer, but we have plans on our internal roadmap to enable dynamic sharing of protected data endpoints."
    }), "\n", createVNode(_components.p, {
      children: "For now, you can simply email the link to your customer, and they can access the data through the link."
    }), "\n", createVNode(_components.h2, {
      id: "steps-to-fulfill-data-requests",
      children: "Steps to Fulfill Data Requests"
    }), "\n", createVNode(_components.h3, {
      id: "1-receive-payment",
      children: "1. Receive Payment"
    }), "\n", createVNode(_components.p, {
      children: "Once a customer completes a payment for your data product, you will receive a notification. This notification will include details about the transaction, such as the amount paid and the customer\u2019s contact information."
    }), "\n", createVNode(_components.h3, {
      id: "2-generate-data-access-link",
      children: "2. Generate Data Access Link"
    }), "\n", createVNode(_components.p, {
      children: "After receiving the payment, you need to send your semantic layer endpoint to your custoner. This endpoint will provide the customer with access to the data they have purchased."
    }), "\n", createVNode(_components.h3, {
      id: "3-email-the-endpoint-to-the-customer",
      children: "3. Email the endpoint to the Customer"
    }), "\n", createVNode(_components.p, {
      children: "Once you have the data access link, you can email it to the customer by finding the customer\u2019s email address in the payments page."
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
const url = "src/content/docs/documentation/commerce/data-fulfillment.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/data-fulfillment.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/data-fulfillment.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
