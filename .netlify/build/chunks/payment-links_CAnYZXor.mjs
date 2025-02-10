import { n as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_Dkj-vugl.mjs';
import { $ as $$Image } from './_astro_assets_DoAXWItE.mjs';
import 'clsx';

const frontmatter = {
  "title": "Payment Links",
  "description": "About Payment Links"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "how-payment-links-work",
    "text": "How Payment Links Work"
  }, {
    "depth": 3,
    "slug": "managing-payments",
    "text": "Managing Payments"
  }, {
    "depth": 2,
    "slug": "benefits-of-payment-links",
    "text": "Benefits of Payment Links"
  }, {
    "depth": 3,
    "slug": "flexibility",
    "text": "Flexibility"
  }, {
    "depth": 3,
    "slug": "ease-of-use",
    "text": "Ease of Use"
  }, {
    "depth": 3,
    "slug": "transparency",
    "text": "Transparency"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "As a merchant on Portcullis, you are responsible for setting and managing your pricing and payment link experience. This means you can choose to offer your data for free, or you can set a price for your data. Currently, we rely on a trust-based system for fee-exchange after you\u2019ve gotten paid, as Stripe Connect still has some API work to do."
    }), "\n", createVNode(_components.p, {
      children: "The way it works is once you receive a payment for X amount, we will invoice you for 25% of that amount. Not the most elegant solution, but it\u2019s a good start."
    }), "\n", createVNode(_components.h2, {
      id: "how-payment-links-work",
      children: "How Payment Links Work"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Generate Links"
        }), ": Users can generate Payment Links directly from the Portcullis platform. These links can be customized to include specific details about the transaction, such as the amount and description."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Customization"
        }), ": Payment Links can be tailored to fit the specific needs of different users and portals. This includes custom branding, descriptions, and pricing."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Sharing Links"
        }), ": Once created, Payment Links can be shared with customers via email, social media, or any other communication channel. When a customer clicks the link, they are directed to a secure payment page."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "managing-payments",
      children: "Managing Payments"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Transaction Completion"
        }), ": Customers can complete their transactions using the secure payment page. Once the payment is processed, the funds are transferred to the user\u2019s Stripe Connect account."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Invoicing"
        }), ": After a payment is received, Portcullis will invoice the user for 25% of the transaction amount. This fee covers the platform\u2019s operational costs and ensures the sustainability of the service."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Payout Management"
        }), ": Stripe Connect manages payouts to data providers. Users can set up automatic payouts to their bank accounts, ensuring they receive their earnings promptly and securely."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "benefits-of-payment-links",
      children: "Benefits of Payment Links"
    }), "\n", createVNode(_components.h3, {
      id: "flexibility",
      children: "Flexibility"
    }), "\n", createVNode(_components.p, {
      children: "Payment Links can be customized to fit the specific needs of different users and portals. This flexibility allows for a wide range of applications and use cases, making it easy to monetize your data."
    }), "\n", createVNode(_components.h3, {
      id: "ease-of-use",
      children: "Ease of Use"
    }), "\n", createVNode(_components.p, {
      children: "Creating and sharing Payment Links is straightforward and user-friendly. The Portcullis platform provides intuitive tools for managing transactions, ensuring a seamless experience for both merchants and customers."
    }), "\n", createVNode(_components.h3, {
      id: "transparency",
      children: "Transparency"
    }), "\n", createVNode(_components.p, {
      children: "The trust-based system for fee-exchange ensures transparency in the payment process. Users are aware of the fees they will be charged, and the invoicing process is clear and straightforward."
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
const url = "src/content/docs/documentation/commerce/payment-links.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/payment-links.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/payment-links.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
