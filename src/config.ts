export const PAYMENT_FREQUENCIES = ["monthly", "yearly"] as const;

export const TIERS = [
  {
    name: "Insights",
    metric: "month",
    price: {
      "monthly": 150,
      "yearly": 97.5,
    },
    description: "For on-demand question oriented Clickhouse support",
    features: [
      "Priority support",
      "Deep Clickhouse understanding",
      "Solutions oriented",
      "POC experts",
    ],
    cta: "Talk to us",
    highlighted: true,
    popular: false,
    href: {
      monthly: "https://cal.com/team/portcullis/insights-intro",
      yearly: "https://cal.com/team/portcullis/insights-intro",
    }
  },
  {
    name: "Insights+",
    price: {
      "monthly": 510,
      yearly: 433,
    },
    description: "For complex research insights such as build/buy reports",
    features: [
      "Same amazing insights",
      "Complex query optimization",
      "24/7 Chat support",
      "1 Report per month",
    ],
    metric: "month",
    cta: "Talk to us",
    highlighted: true,
    popular: true,
    href: {
      monthly: "https://cal.com/team/portcullis/insights-plus-intro",
      yearly: "https://cal.com/team/portcullis/insights-plus-intro",
    },
  },
  {
    name: "Portcullis",
    metric: "month",
    price: {
      "monthly": 4300,
      "yearly": 2795,
    },
    description: "Everything in Insights+ plus reports, dashboards, and more",
    features: [
      "POC steering reports",
      "Custom Dashboards",
      "Tooling audits",
      "Monthly training for your team",
    ],
    cta: "Start a conversation",
    highlighted: true,
    popular: false,
    href: {
      monthly: "https://cal.com/team/portcullis/portcullis-gold-intro",
      yearly: "https://cal.com/team/portcullis/portcullis-gold-intro",
    },
  },
  // Add more tiers as needed
] as const; 