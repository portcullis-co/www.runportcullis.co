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
      monthly: "https://buy.stripe.com/dR6fZe4R1e5R4owcMS",
      yearly: "https://buy.stripe.com/8wM28o1EP2n94ow8wA",
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
      monthly: "https://buy.stripe.com/7sI9AQ6Z9aTFbQYdQS",
      yearly: "https://buy.stripe.com/eVa00g5V5aTFbQY4gj",
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
      monthly: "https://buy.stripe.com/aEU14k6Z91j57AI8wx",
      yearly: "https://cal.com/portcullis/insights",
    },
  },
  // Add more tiers as needed
] as const; 