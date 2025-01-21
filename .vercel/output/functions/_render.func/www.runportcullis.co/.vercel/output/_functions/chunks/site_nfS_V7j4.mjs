const siteConfig = {
  name: "Portcullis",
  description: "Get your own personal #help channel without having to wait hours for support",
  url: "https://www.runportcullis.co",
  ogImage: "/og.png",
  links: {
    twitter: "",
    github: "https://github.com/portcullis-co/"
  }
};
const footerLinks = [
  {
    title: "Legal",
    items: [
      { title: "Terms", href: "/legal/terms" },
      { title: "Privacy", href: "/legal/privacy" }
    ]
  },
  {
    title: "Company",
    items: [
      { title: "Contact", href: "/schedule-a-chat" },
      { title: "Discord", href: "https://discord.gg/gPCSXNtjcN" },
      { title: "Blog", href: "/blog" }
    ]
  },
  {
    title: "Services",
    items: [
      { title: "OSS Deployments", href: "/services/oss-support" },
      { title: "Content Writing", href: "/services/content-writing" },
      { title: "General Clickhouse Support", href: "/services/clickhouse-support" },
      { title: "Query Optimization", href: "/services/query-optimization" }
    ]
  }
];

export { footerLinks as f, siteConfig as s };
