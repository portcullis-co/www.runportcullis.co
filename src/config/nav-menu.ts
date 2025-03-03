import type { NavMenuConfig } from "@/types";

export const navMenuConfig: NavMenuConfig = {
  aboutNav: [
    {
      title: "About",
      items: [
        {
          title: "Pricing",
          href: "/pricing",
          description:
            "Transparent pricing for all our services",
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
  servicesNav: [
    {
      title: "Services",
      items: [
        {
          title: "Project Planning",
          href: "/services/project-planning",
          description:
            "Get high-level project planning and architecture design to ensure your data warehouse is built to last",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
         {
           title: "Content Writing",
           href: "/services/content-writing",
           description: "Like our blog? We can do that for your site too.",
           image: "/images/examples/pricing.jpg",
         },
        {
          title: "Query Optimization",
          href: "/services/query-optimization",
          description: "Hire us to squeeze the most performance out of your queries",
          image: "/images/examples/pricing.jpg",
        },
      ],
    },
  ],
  links: [
    {
      title: "Get a free trial",
      href: "/pricing",
      description: "Get a free trial of our enterprise-grade support",
      image: "/images/examples/pricing.jpg",
    },
  ],
};
