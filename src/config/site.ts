import type { SidebarNavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Portcullis",
  description:
    "Get your own personal #help channel without having to wait hours for support",
  url: "https://www.runportcullis.co",
  ogImage: "/og.png",
  links: {
    twitter: "",
    github: "https://github.com/portcullis-co/",
  },
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Legal",
    items: [
      { title: "Terms", href: "/legal/terms" },
      { title: "Privacy", href: "/legal/privacy" },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Contact", href: "/pricing" },
      { title: "Blog", href: "/blog" },
    ],
  },

];