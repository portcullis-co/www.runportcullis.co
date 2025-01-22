import { _ as __astro_tag_component__, F as Fragment, n as createVNode } from './astro/server_DlAcna1r.mjs';
import { $ as $$Image } from './_astro_assets_D9QlpF0I.mjs';
import 'clsx';

const frontmatter = {
  "title": "Stripe Connect",
  "description": "About Stripe Connect"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "why-stripe-connect",
    "text": "Why Stripe Connect?"
  }, {
    "depth": 2,
    "slug": "stripe-connect-onboarding-process",
    "text": "Stripe Connect Onboarding Process"
  }, {
    "depth": 3,
    "slug": "step-1-account-setup",
    "text": "Step 1: Account Setup"
  }, {
    "depth": 3,
    "slug": "step-2-payment-processing",
    "text": "Step 2: Payment Processing"
  }, {
    "depth": 3,
    "slug": "step-3-managing-payouts",
    "text": "Step 3: Managing Payouts"
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
      children: "Every user will be required to go through the Stripe Connect onboarding at some point if you are interested in using the commerce features of Portcullis. Stripe Connect is a powerful platform that enables businesses to accept payments and manage payouts globally. This integration allows Portcullis users to monetize their data seamlessly and securely."
    }), "\n", createVNode(_components.h2, {
      id: "why-stripe-connect",
      children: "Why Stripe Connect?"
    }), "\n", createVNode(_components.p, {
      children: "Stripe Connect is chosen for its robust features and ease of use, making it an ideal solution for handling financial transactions on the Portcullis platform. Here are some key reasons why we use Stripe Connect:"
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
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Compliance"
        }), ": Stripe Connect ensures compliance with global payment regulations, giving users peace of mind."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "stripe-connect-onboarding-process",
      children: "Stripe Connect Onboarding Process"
    }), "\n", createVNode(_components.h3, {
      id: "step-1-account-setup",
      children: "Step 1: Account Setup"
    }), "\n", createVNode(_components.p, {
      children: "To get started with Stripe Connect, users need to set up a Stripe Connect account. This process is straightforward and can be completed directly from the Portcullis platform."
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Sign Up"
        }), ": Users will be prompted to sign up for a Stripe Connect account. This involves providing basic information about their business."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Verification"
        }), ": Users will need to verify their identity and business details. This may involve uploading documents such as IDs, business licenses, and bank statements."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Account Activation"
        }), ": Once the verification process is complete, the Stripe Connect account will be activated, and users can start accepting payments and managing payouts."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "step-2-payment-processing",
      children: "Step 2: Payment Processing"
    }), "\n", createVNode(_components.p, {
      children: "Once the Stripe Connect account is set up, users can start accepting payments for their data and portals. Here\u2019s how the payment processing works:"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Payment Links"
        }), ": Users can create Payment Links that direct customers to a secure payment page. These links can be customized to include specific details about the transaction, such as the amount and description."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Transaction Completion"
        }), ": Customers can complete their transactions using the secure payment page. Once the payment is processed, the funds are transferred to the user\u2019s Stripe Connect account."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Payout Management"
        }), ": Stripe Connect manages payouts to data providers. Users can set up automatic payouts to their bank accounts, ensuring they receive their earnings promptly and securely."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "step-3-managing-payouts",
      children: "Step 3: Managing Payouts"
    }), "\n", createVNode(_components.p, {
      children: "Stripe Connect makes it easy to manage payouts. Users can:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Set Up Automatic Payouts"
        }), ": Users can configure their Stripe Connect account to automatically transfer funds to their bank account on a regular schedule."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "View Transaction History"
        }), ": Users can view a detailed history of all transactions, including payments received and payouts made."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Manage Payout Settings"
        }), ": Users can adjust their payout settings, such as changing the payout schedule or bank account details."]
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
const url = "src/content/docs/documentation/commerce/stripe-connect.mdx";
const file = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/stripe-connect.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jdbohrman/www.runportcullis.co/src/content/docs/documentation/commerce/stripe-connect.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
