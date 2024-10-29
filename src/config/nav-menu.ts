import type { NavMenuConfig } from "@/types";

export const navMenuConfig: NavMenuConfig = {
  pagesNav: [
    {
      title: "About",
      items: [
        {
          title: "Contact",
          href: "/contact",
          description:
            "Have a question? Want to learn more? Contact us.",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
        {
          title: "Compatibility (Coming soon!)",
          href: "/",
          description: "Check out the list of tools we support.",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Pricing",
          href: "/pricing",
          description: "Pricing cards, FAQs and more content with price.",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Examples (Coming soon!)",
          href: "",
          description:
            "Check out a few demonstration portals",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
      ],
    },

  ],
  links: [
     {
       title: "Blog",
       href: "/blog",
       description: "Blog",
       image: "/images/examples/image.jpg",
     },
  ],
};
