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
          title: "Discord",
          href: "https://discord.gg/JZCMf55GZa",
          description: "Join our Discord to chat with the team and learn more about Portcullis.",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Pricing",
          href: "/pricing",
          description: "Pricing cards, FAQs and more content with price.",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Github",
          href: "https://github.com/portcullis-co/",
          description:
            "Check out our Github for some projects we've worked on and more information.",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
      ],
    },

  ],
  links: [
  ],
};
