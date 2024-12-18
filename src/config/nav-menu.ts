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
         {
           title: "Blog",
           href: "/blog",
           description: "Check out Clickhouse and data engineering related content from our team",
           image: "/images/examples/pricing.jpg",
         },
        {
          title: "Discuss a project",
          href: "https://cal.com/portcullisjames/intro-call",
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
