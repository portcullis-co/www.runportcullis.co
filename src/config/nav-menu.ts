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
          title: "Request an API key",
          href: "/get-started",
          description: "Tell us a bit about your needs and request an API key",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Dashboard",
          href: "https://app.portcullis.co/sign-in",
          description: "Sign into your account",
          image: "/images/examples/pricing.jpg",
        },
        {
          title: "Docs",
          href: "https://docs.runportcullis.co",
          description:
            "Check out our docs to learn more about our capabilities",
          image: "/images/examples/waitlist.jpg",
          forceReload: true,
        },
      ],
    },

  ],
  links: [
  ],
};
