import type { NavMenuConfig } from "@/types";

export const navMenuConfig: NavMenuConfig = {
  aboutNav: [
    {
      title: "About",
      items: [
        {
          title: "Porticia",
          href: "/talk",
          description:
            "Meet Porticia, our AI assistant",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
        {
          title: "Referral Program",
          href: "/referral-program",
          description: "Refer a friend and earn a reward",
          image: "/images/examples/pricing.jpg",
        },
      ],
    },
  ],
  links: [
    {
      title: "Get a free quote",
      href: "/talk",
      description: "Get a free quote for our services",
      image: "/images/examples/pricing.jpg",
    },
  ],
};
