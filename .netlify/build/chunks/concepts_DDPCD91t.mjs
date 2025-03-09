import { l as createVNode, F as Fragment, _ as __astro_tag_component__ } from "./astro/server_aMtVhhw-.mjs";
import { $ as $$Image } from "./_astro_assets_C6DxmjWZ.mjs";
import "clsx";
const frontmatter = {
  "title": "Concepts",
  "description": "The underlying primitives of Portcullis"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "commerce-stripe-connect",
    "text": "Commerce: Stripe Connect"
  }, {
    "depth": 3,
    "slug": "what-is-stripe-connect",
    "text": "What is Stripe Connect?"
  }, {
    "depth": 3,
    "slug": "how-stripe-connect-works-in-portcullis",
    "text": "How Stripe Connect Works in Portcullis"
  }, {
    "depth": 3,
    "slug": "benefits-of-stripe-connect",
    "text": "Benefits of Stripe Connect"
  }, {
    "depth": 2,
    "slug": "payment-links",
    "text": "Payment Links"
  }, {
    "depth": 3,
    "slug": "what-are-payment-links",
    "text": "What are Payment Links?"
  }, {
    "depth": 2,
    "slug": "portals",
    "text": "Portals"
  }, {
    "depth": 3,
    "slug": "what-are-portals",
    "text": "What are Portals?"
  }, {
    "depth": 3,
    "slug": "how-portals-work",
    "text": "How Portals Work"
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
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Portcullis is designed to be a versatile and powerful platform for data sharing and commercialization. This document outlines the core concepts that make Portcullis unique and effective: Commerce (Stripe Connect), Payment Links, and Portals."
    }), "\n", createVNode(_components.h2, {
      id: "commerce-stripe-connect",
      children: "Commerce: Stripe Connect"
    }), "\n", createVNode(_components.h3, {
      id: "what-is-stripe-connect",
      children: "What is Stripe Connect?"
    }), "\n", createVNode(_components.p, {
      children: "Stripe Connect is a powerful platform that allows businesses to accept payments and manage payouts globally. Portcullis integrates Stripe Connect to facilitate secure and efficient transactions, enabling users to monetize their data seamlessly."
    }), "\n", createVNode(_components.h3, {
      id: "how-stripe-connect-works-in-portcullis",
      children: "How Stripe Connect Works in Portcullis"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Account Setup"
        }), ": Users can easily set up a Stripe Connect account through the Portcullis platform. This account will be used to manage all financial transactions related to data sharing."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Payment Processing"
        }), ": When a user purchases data or access to a portal, Stripe Connect handles the payment processing. This ensures that transactions are secure and compliant with global payment standards."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Payout Management"
        }), ": Stripe Connect also manages payouts to data providers. Users can set up automatic payouts to their bank accounts, ensuring they receive their earnings promptly and securely."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "benefits-of-stripe-connect",
      children: "Benefits of Stripe Connect"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Global Reach"
        }), ": Stripe Connect supports payments in multiple currencies and countries, making it easy for users to monetize their data globally."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Security"
        }), ": Stripe Connect adheres to the highest security standards, ensuring that all transactions are safe and secure."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Ease of Use"
        }), ": The integration of Stripe Connect into Portcullis makes it simple for users to set up and manage their payments and payouts."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "payment-links",
      children: "Payment Links"
    }), "\n", createVNode(_components.h3, {
      id: "what-are-payment-links",
      children: "What are Payment Links?"
    }), "\n", createVNode(_components.p, {
      children: "Payment Links are unique Stripe URLs that you can create to facilitate payments for your portals. These links direct your customers to a secure payment page where they can complete their transactions."
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Creation"
        }), ": Your will need to generate your own Payment Links directly from the Stripe Connect platform. These links can be customized to include specific details about the transaction, such as the amount and description."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Sharing"
        }), ": You can share Payment Links with their customers via email, social media, or embed them directly in your portal. When a customer clicks the link, they are directed to a secure payment page."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Transaction Completion"
        }), ": Customers can complete their transactions using your secure payment page. Once the payment is processed, the funds are transferred to your Stripe account directly."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "portals",
      children: "Portals"
    }), "\n", createVNode(_components.h3, {
      id: "what-are-portals",
      children: "What are Portals?"
    }), "\n", createVNode(_components.p, {
      children: "Portals in Portcullis are endlessly flexible environments created using IFrames. These portals can be tailored to fit the specific needs of different users and applications, providing a flexible and powerful data-sharing solution."
    }), "\n", createVNode(_components.h3, {
      id: "how-portals-work",
      children: "How Portals Work"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Customization"
        }), ": Portals can be endlessly customized to meet the unique requirements of different users. This includes custom branding, layouts, and functionalities."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Isolation"
        }), ": Each portal operates as an independent web page within the main Portcullis interface. This isolation ensures that data and code from one portal do not interfere with others."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Security"
        }), ": Portals use sandboxing techniques to enforce security policies. This means that even if a portal contains malicious code, it cannot affect the main application or other portals."]
      }), "\n"]
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
const url = "src/content/docs/documentation/concepts.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/concepts.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment, ...props.components, "astro-image": props.components?.img ?? $$Image }
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/concepts.mdx";
export {
  Content,
  __usesAstroImage,
  Content as default,
  file,
  frontmatter,
  getHeadings,
  url
};
