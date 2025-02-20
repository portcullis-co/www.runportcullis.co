import type { NavMenuConfig } from "@/types";

export const navMenuConfig: NavMenuConfig = {
  aboutNav: [
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
           title: "Free Trial",
           href: "/pricing",
           description: "Get a free trial of our enterprise-grade support",
           image: "/images/examples/pricing.jpg",
         },
        {
          title: "Discuss a project",
          href: "https://cal.com/portcullisjames",
          description: "Talk to us about a project you need help with",
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
