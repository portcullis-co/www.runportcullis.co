import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from "../chunks/astro/server_aMtVhhw-.mjs";
import { a as cn, B as Badge, d as Button, $ as $$MainLayout } from "../chunks/main-layout_BsXR2W6X.mjs";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import NumberFlow from "@number-flow/react";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { motion as motion$1 } from "motion/react";
import { renderers } from "../renderers.mjs";
let navigateOnServerWarned = false;
async function navigate(href, options) {
  {
    if (!navigateOnServerWarned) {
      const warning = new Error(
        "The view transitions client API was called during a server side render. This may be unintentional as the navigate() function is expected to be called in response to user interactions. Please make sure that your usage is correct."
      );
      warning.name = "Warning";
      console.warn(warning);
      navigateOnServerWarned = true;
    }
    return;
  }
}
const SparklesText = ({
  text,
  colors = { first: "#9E7AFF", second: "#FE8BBB" },
  className,
  sparklesCount = 10,
  ...props
}) => {
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    const generateStar = () => {
      const starX = `${Math.random() * 100}%`;
      const starY = `${Math.random() * 100}%`;
      const color = Math.random() > 0.5 ? colors.first : colors.second;
      const delay = Math.random() * 2;
      const scale = Math.random() * 1 + 0.3;
      const lifespan = Math.random() * 10 + 5;
      const id = `${starX}-${starY}-${Date.now()}`;
      return { id, x: starX, y: starY, color, delay, scale, lifespan };
    };
    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar);
      setSparkles(newSparkles);
    };
    const updateStars = () => {
      setSparkles(
        (currentSparkles) => currentSparkles.map((star) => {
          if (star.lifespan <= 0) {
            return generateStar();
          } else {
            return { ...star, lifespan: star.lifespan - 0.1 };
          }
        })
      );
    };
    initializeStars();
    const interval = setInterval(updateStars, 100);
    return () => clearInterval(interval);
  }, [colors.first, colors.second]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("text-6xl font-bold", className),
      ...props,
      style: {
        "--sparkles-first-color": `${colors.first}`,
        "--sparkles-second-color": `${colors.second}`
      },
      children: /* @__PURE__ */ jsxs("span", { className: "relative inline-block", children: [
        sparkles.map((sparkle) => /* @__PURE__ */ jsx(Sparkle, { ...sparkle }, sparkle.id)),
        /* @__PURE__ */ jsx("strong", { children: text })
      ] })
    }
  );
};
const Sparkle = ({ id, x, y, color, delay, scale }) => {
  return /* @__PURE__ */ jsx(
    motion.svg,
    {
      className: "pointer-events-none absolute z-20",
      initial: { opacity: 0, left: x, top: y },
      animate: {
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150]
      },
      transition: { duration: 0.8, repeat: Infinity, delay },
      width: "21",
      height: "21",
      viewBox: "0 0 21 21",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z",
          fill: color
        }
      )
    },
    id
  );
};
const PricingCard = ({ tier, paymentFrequency }) => {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  tier.href[paymentFrequency];
  const buttonText = tier.buttonText || "Get Started";
  const fifteenBucksLittleMan = () => {
    console.log("Put that money in my hand!");
    navigate();
  };
  return /* @__PURE__ */ jsxs("div", { className: cn(
    "relative rounded-xl border p-6",
    isHighlighted ? "border-primary bg-primary/5" : "border-border"
  ), children: [
    isHighlighted && /* @__PURE__ */ jsx(HighlightedBackground, {}),
    isPopular && /* @__PURE__ */ jsx(PopularBackground, {}),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold flex items-center", children: [
        tier.name,
        tier.name === "Portcullis" && /* @__PURE__ */ jsx(SparklesText, { colors: { first: "#FFD700", second: "#D4AF37" }, text: "Gold", className: "ml-1 text-yellow-500 text-xl font-bold" })
      ] }),
      isPopular && /* @__PURE__ */ jsx(Badge, { className: "ml-2 bg-secondary text-secondary-foreground", children: "🔥 Most Popular" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 min-h-20 flex flex-col justify-start", children: typeof price === "number" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline", children: [
        /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold", children: "$" }),
        /* @__PURE__ */ jsx(
          NumberFlow,
          {
            value: price,
            duration: 1e3,
            className: "text-3xl font-bold"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "Per ",
        tier.metric,
        " | Billed ",
        paymentFrequency
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold", children: price }) }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 min-h-60", children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: tier.features.map((feature, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(BadgeCheck, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: feature })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: fifteenBucksLittleMan,
        className: "w-full",
        variant: isHighlighted ? "default" : "outline",
        children: [
          buttonText,
          " ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ]
      }
    )
  ] });
};
const HighlightedBackground = () => /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-xl bg-primary/5 -z-10" });
const PopularBackground = () => /* @__PURE__ */ jsx("div", { className: "absolute -top-3 -right-3 h-6 w-6 rounded-full bg-secondary" });
const Tab = ({
  text,
  selected,
  setSelected,
  discount = false
}) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => setSelected(text),
      className: cn(
        "relative w-fit px-4 py-2 text-sm font-semibold capitalize text-foreground transition-colors",
        discount && "flex items-center justify-center gap-2.5"
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "relative z-10", children: text }),
        selected && /* @__PURE__ */ jsx(
          motion$1.span,
          {
            layoutId: "tab",
            transition: { type: "spring", duration: 0.4 },
            className: "absolute inset-0 z-0 rounded-full bg-background shadow-sm"
          }
        ),
        discount && /* @__PURE__ */ jsx(
          Badge,
          {
            className: cn(
              "relative z-10 whitespace-nowrap bg-gray-100 text-xs text-black shadow-none hover:bg-gray-100",
              selected ? "bg-[#F3F4F6] hover:bg-[#F3F4F6]" : "bg-gray-300 hover:bg-gray-300"
            ),
            children: "Save up to 35%"
          }
        )
      ]
    }
  );
};
const PricingHeader = ({
  title,
  subtitle,
  frequencies,
  selectedFrequency,
  onFrequencyChange
}) => /* @__PURE__ */ jsxs("div", { className: "space-y-7 text-center", children: [
  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-medium md:text-5xl", children: title }),
    /* @__PURE__ */ jsx("p", { children: subtitle })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "mx-auto flex w-fit rounded-full bg-[#F3F4F6] p-1 dark:bg-[#222]", children: frequencies.map((freq) => /* @__PURE__ */ jsx(
    Tab,
    {
      text: freq,
      selected: selectedFrequency === freq,
      setSelected: onFrequencyChange,
      discount: freq === "yearly"
    },
    freq
  )) })
] });
const PAYMENT_FREQUENCIES = ["monthly", "yearly"];
const TIERS = [
  {
    name: "Insights",
    metric: "month",
    price: {
      "monthly": 150,
      "yearly": 97.5
    },
    description: "For on-demand question oriented Clickhouse support",
    features: [
      "Priority support",
      "Deep Clickhouse understanding",
      "Solutions oriented",
      "POC experts"
    ],
    cta: "Talk to us",
    highlighted: true,
    popular: false,
    href: {
      monthly: "https://cal.com/team/portcullis/insights-intro",
      yearly: "https://cal.com/team/portcullis/insights-intro"
    }
  },
  {
    name: "Insights+",
    price: {
      "monthly": 510,
      yearly: 433
    },
    description: "For complex research insights such as build/buy reports",
    features: [
      "Same amazing insights",
      "Complex query optimization",
      "24/7 Chat support",
      "1 Report per month"
    ],
    metric: "month",
    cta: "Talk to us",
    highlighted: true,
    popular: true,
    href: {
      monthly: "https://cal.com/team/portcullis/insights-plus-intro",
      yearly: "https://cal.com/team/portcullis/insights-plus-intro"
    }
  },
  {
    name: "Portcullis",
    metric: "month",
    price: {
      "monthly": 4300,
      "yearly": 2795
    },
    description: "Everything in Insights+ plus reports, dashboards, and more",
    features: [
      "POC steering reports",
      "Custom Dashboards",
      "Tooling audits",
      "Monthly training for your team"
    ],
    cta: "Start a conversation",
    highlighted: true,
    popular: false,
    href: {
      monthly: "https://cal.com/team/portcullis/portcullis-gold-intro",
      yearly: "https://cal.com/team/portcullis/portcullis-gold-intro"
    }
  }
  // Add more tiers as needed
];
const Pricing = () => {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState(
    "monthly"
  );
  return /* @__PURE__ */ jsxs("section", { className: "flex flex-col items-center gap-10 py-10", children: [
    /* @__PURE__ */ jsx(
      PricingHeader,
      {
        title: "Plans and Pricing",
        subtitle: "Receive unlimited credits when you pay yearly, and save on your plan.",
        frequencies: PAYMENT_FREQUENCIES,
        selectedFrequency: selectedPaymentFreq,
        onFrequencyChange: setSelectedPaymentFreq
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3", children: TIERS.map((tier, i) => /* @__PURE__ */ jsx(
      PricingCard,
      {
        tier,
        paymentFrequency: selectedPaymentFreq
      },
      i
    )) })
  ] });
};
const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Pricing", "mainClass": "flex-1 bg-background-200" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24"> <div class="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]"> <h2 class="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
Transparent pricing with a 1-week free trial and easy onboarding
</h2> <p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
Get started today with a 1-week free trial and concierge onboarding
</p> </div> ${renderComponent($$result2, "PricingComponent", Pricing, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pricing/Pricing", "client:component-export": "Pricing" })} </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/pricing.astro", void 0);
const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/pricing.astro";
const $$url = "/pricing";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
