import type { SidebarNavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Portcullis",
  description:
    "Magic 🔗's for secure and painless enterprise data export",
  url: "https://www.runportcullis.co",
  ogImage: "/og.jpg",
  links: {
    twitter: "",
    github: "https://github.com/portcullis-co/",
  },
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "Pricing", href: "/pricing" },
      { title: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
];