const siteConfig = {
  name: "Portcullis",
  description: "Get your own personal #help channel without having to wait hours for support"
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
      { title: "Contact", href: "/pricing" },
      { title: "Blog", href: "/blog" }
    ]
  },
  {
    title: "Services",
    items: [
      { title: "Project Planning", href: "/services/project-planning" },
      { title: "Content Writing", href: "/services/content-writing" },
      { title: "General Clickhouse Support", href: "/services/clickhouse-support" },
      { title: "Query Optimization", href: "/services/query-optimization" }
    ]
  }
];
export {
  footerLinks as f,
  siteConfig as s
};
