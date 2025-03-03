export const PAYMENT_FREQUENCIES = ["usage-based", "prepaid"] as const;

export const TIERS = [
  {
    name: "Free Trial",
    metric: "insight",
    price: {
      "usage-based": 0,
      "prepaid": 0,
    },
    description: "Get your first week of insights for free, then decide next steps.",
    features: [
      "No restrictions",
      "No contracts",
      "Get to know us",
      "Great for planning"
    ],
    cta: "Talk to us",
    highlighted: false,
    popular: false,
  },
  {
    name: "Insights",
    metric: "insight",
    price: {
      "usage-based": 150,
      "prepaid": 112.5,
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
  },
  {
    name: "Reports",
    price: {
      "usage-based": 510,
      prepaid: "Let's chat",
    },
    description: "For complex research insights such as build/buy reports",
    features: [
      "Expert report crafting",
      "~1 week delivery",
      "Consistent communication",
      "Graphs and pretty charts",
    ],
    metric: "report",
    cta: "Talk to us",
    highlighted: true,
    popular: false,
  },
  {
    name: "Dashboards",
    metric: "month",
    price: {
      "usage-based": "Let's chat",
      "prepaid": "Let's chat",
    },
    description: "For metrics driven companies",
    features: [
      "Beautiful Shadcn and Streamlit dashboards",
      "Query optimization support",
      "Save thousands on third-party tools",
      "Subdomain setup",
    ],
    cta: "Talk to us",
    highlighted: true,
    popular: false,
  },
  // Add more tiers as needed
] as const; 