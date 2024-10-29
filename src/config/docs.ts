import type { DocsConfig } from "@/types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs/getting-started/",
    },
    {
      title: "Guides",
      href: "/guides",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/getting-started/",
        },
        {
          title: "Why tho?",
          href: "/docs/documentation/",
        },
      ],
    },
    {
      title: "Concepts",
      items: [
        {
          title: "Stripe Connect",
          href: "/docs/documentation/commerce/stripe-connect",
        },
        {
          title: "Portals",
          href: "/docs/documentation/commerce/portals",
        },
      ],
    },
  ],
};
