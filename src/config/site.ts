import type { SidebarNavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Portcullis",
  description:
    "The Clickhouse-native solution studio for petabyte-scale ideas",
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
      { title: "Contact", href: "/schedule-a-chat" },
      { title: "Discord", href: "https://discord.gg/gPCSXNtjcN" },
      { title: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    items: [
      { title: "OSS Deployments", href: "/services/oss-support" },
      { title: "Content Writing", href: "/services/content-writing" },
      { title: "General Clickhouse Support", href: "/services/clickhouse-support" },
      { title: "Query Optimization", href: "/services/query-optimization" },
    ],
  },
];