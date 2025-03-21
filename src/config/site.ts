import type { SidebarNavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Portcullis",
  description:
    "Data doldrums? Let us put some 💨 in your project ",
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