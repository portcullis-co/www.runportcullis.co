import type { SidebarNavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Portcullis",
  description:
    "Embedded ETL for enterprise data sharing",
  url: "https://www.runportcullis.co",
  ogImage: "/og.png",
  links: {
    twitter: "",
    github: "https://github.com/portcullis-co/",
  },
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "Contact", href: "/schedule-a-chat" },
      { title: "Discord", href: "https://discord.gg/gPCSXNtjcN" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Terms", href: "/legal/terms" },
      { title: "Privacy", href: "/legal/privacy" },
    ],
  },
];