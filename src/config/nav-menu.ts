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
            "Questions, concerns, airing of greivances? Shoot us an email.",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
        // {
        //   title: "Indieprise",
        //   href: "/",
        //   description: "Read from Indieprise, our blog about indie software for enterprise markets",
        //   image: "/images/examples/pricing.jpg",
        // },
        {
          title: "Discuss a project",
          href: "/schedule-a-chat",
          description: "Talk to us about a Clickhouse project you have in mind",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Discord",
          href: "https://discord.gg/gPCSXNtjcN",
          description:
            "Join the Portcullis community Discord for data engineers",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
      ],
    },

  ],
  links: [
  ],
};
