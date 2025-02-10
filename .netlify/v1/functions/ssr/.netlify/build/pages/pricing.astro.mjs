import { a as createComponent, r as renderTemplate, b as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Dkj-vugl.mjs';
import { a as cn, d as Button, $ as $$MainLayout } from '../chunks/main-layout_D_DuIfBx.mjs';
import { $ as $$Icon } from '../chunks/Icon_ynEii2al.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useCallback } from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const Dialog = SheetPrimitive.Root;
const DialogPortal = SheetPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = SheetPrimitive.Description.displayName;

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

function SlackConnectDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    jobTitle: ""
  });
  const isFormValid = useCallback(() => {
    return Object.values(formData).every((value) => value.trim() !== "") && consent;
  }, [formData, consent]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: () => setOpen(true),
        size: "lg",
        className: "flex items-center",
        children: [
          /* @__PURE__ */ jsx("img", { className: "h-11 w-11", src: "https://cdn.brandfetch.io/idJ_HhtG0Z/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Start Trial" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[600px]", children: status === "success" ? /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Invitation Sent!" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Check your email for an invitation to connect with us on Slack." }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setOpen(false), className: "mt-4", children: "Close" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Connect with us on Slack" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Fill out this form to get an invitation to our Slack workspace." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            required: true,
            type: "email",
            name: "email",
            placeholder: "Email",
            value: formData.email,
            onChange: handleInputChange
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              required: true,
              name: "firstName",
              placeholder: "First Name",
              value: formData.firstName,
              onChange: handleInputChange
            }
          ),
          /* @__PURE__ */ jsx(
            Input,
            {
              required: true,
              name: "lastName",
              placeholder: "Last Name",
              value: formData.lastName,
              onChange: handleInputChange
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            required: true,
            name: "companyName",
            placeholder: "Company Name",
            value: formData.companyName,
            onChange: handleInputChange
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            required: true,
            name: "jobTitle",
            placeholder: "Job Title",
            value: formData.jobTitle,
            onChange: handleInputChange
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              name: "consent",
              id: "consent",
              checked: consent,
              onChange: (e) => setConsent(e.target.checked),
              required: true
            }
          ),
          /* @__PURE__ */ jsxs("label", { htmlFor: "consent", className: "text-sm text-gray-600", children: [
            "I agree to the ",
            /* @__PURE__ */ jsx("a", { href: "/legal/terms", className: "text-primary hover:underline", onClick: (e) => e.stopPropagation(), children: "Terms of Service" }),
            " and",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/legal/privacy", className: "text-primary hover:underline", onClick: (e) => e.stopPropagation(), children: "Privacy Policy" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: status === "loading" || !isFormValid(),
            className: "w-full",
            children: status === "loading" ? "Sending..." : "Get Slack Invite"
          }
        )
      ] })
    ] }) })
  ] });
}

const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Pricing", "mainClass": "flex-1 bg-background-200" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24"> <div class="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]"> <h2 class="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
Transparent hourly billing with a one-week free trial
</h2> <p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
Get a little taste of what quality support looks like with a one-week free trial
</p> </div> <div class="grid w-full items-start gap-10 rounded-3xl overflow-hidden border p-10 md:grid-cols-[1fr_200px] bg-background"> <div class="grid gap-6"> <h3 class="text-xl font-bold sm:text-2xl">
Flat Hourly Rate
</h3> <ul class="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2"> <li class="flex items-center"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:check", "class": "mr-2 size-4" })} ~24/7 Availability
</li> <li class="flex items-center"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:check", "class": "mr-2 size-4" })} Expert Clickhouse Knowledge
</li> <li class="flex items-center"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:check", "class": "mr-2 size-4" })} White glove onboarding
</li> <li class="flex items-center"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:check", "class": "mr-2 size-4" })} Analytics Dashboards
</li> <li class="flex items-center"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:check", "class": "mr-2 size-4" })} Query Optimization Support
</li> <li class="flex items-center"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "lucide:check", "class": "mr-2 size-4" })} Migrations
</li> </ul> </div> <div class="flex flex-col gap-4 text-center"> <div> <h4 class="text-4xl font-bold">$268/hr</h4> </div> ${renderComponent($$result2, "SlackConnectDialog", SlackConnectDialog, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/slack-connect-dialog", "client:component-export": "default" })} </div> </div> <!-- <div
    class="grid w-full items-start gap-10 rounded-3xl overflow-hidden border p-10 md:grid-cols-[1fr_200px] bg-background"
  >
    <div class="grid gap-6">
      <h3 class="text-xl font-bold sm:text-2xl">
        Happy Business Plan
      </h3>
      <ul class="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <li class="flex items-center">
          <Icon name="lucide:check" class="mr-2 size-4" /> Advanced Analytics 
        </li>
        <li class="flex items-center">
          <Icon name="lucide:check" class="mr-2 size-4" /> Exclusive business sources (API, CSV, Clickhouse, Clay, etc)
        </li>
        <li class="flex items-center">
          <Icon name="lucide:check" class="mr-2 size-4" /> Instant Support
        </li>

        <li class="flex items-center">
          <Icon name="lucide:check" class="mr-2 size-4" /> Fully branded portals
        </li>
        <li class="flex items-center">
          <Icon name="lucide:check" class="mr-2 size-4" /> Outreach and engagement tools
        </li>
        <li class="flex items-center">
          <Icon name="lucide:check" class="mr-2 size-4" /> Privacy and security tools
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-4 text-center">
      <div>
        <h4 class="text-4xl font-bold">$240/mo</h4>
        <p class="text-sm font-medium text-muted-foreground">
           + 0% Merchant Fees
        </p>
      </div>
      <a href="https://buy.stripe.com/dR64i3dfF3So37y3co" class={cn(buttonVariants({ size: "lg" }))}>
        Join the waitlist
      </a>
    </div> --> <div class="mx-auto flex w-full max-w-[58rem] flex-col gap-4"></div> </section> ` })}`;
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/pricing.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/pricing.astro";
const $$url = "/pricing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
