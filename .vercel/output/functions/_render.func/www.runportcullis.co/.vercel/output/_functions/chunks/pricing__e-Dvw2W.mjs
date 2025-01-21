import { s as createComponent, t as renderTemplate, u as renderComponent, v as maybeRenderHead, w as addAttribute } from './astro/server_C2DrDyYu.mjs';
import { a as cn, e as Button, d as $$Icon, b as buttonVariants, $ as $$MainLayout } from './main-layout_Bd35tQXg.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState } from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

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

function SlackConnectDialog({ children }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    jobTitle: "",
    consent: false
  });
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx("div", { onClick: () => setOpen(true), children }),
    /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-[600px]", children: status === "success" ? /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Invitation Sent!" }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Check your email for an invitation to connect with us on Slack." }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setOpen(false), className: "mt-4", children: "Close" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Get a free one-week trial" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Tell us about your business to get started." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 col-span-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Work Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "email",
                name: "email",
                value: formData.email,
                onChange: handleInputChange,
                placeholder: "you@company.com",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "First Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                name: "firstName",
                value: formData.firstName,
                onChange: handleInputChange,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Last Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                name: "lastName",
                value: formData.lastName,
                onChange: handleInputChange,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Company Name" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                name: "companyName",
                value: formData.companyName,
                onChange: handleInputChange,
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Job Title" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                name: "jobTitle",
                value: formData.jobTitle,
                onChange: handleInputChange,
                required: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "consent",
              name: "consent",
              className: "mt-1",
              checked: formData.consent,
              onChange: handleInputChange,
              required: true
            }
          ),
          /* @__PURE__ */ jsxs("label", { htmlFor: "consent", className: "text-sm text-gray-600", children: [
            "I agree to receive communications from Portcullis. You can unsubscribe at any time. By submitting this form, you acknowledge that you have read and understand our",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/legal/privacy",
                target: "_blank",
                className: "text-blue-600 hover:underline",
                onClick: (e) => e.stopPropagation(),
                children: "Privacy Policy"
              }
            ),
            " ",
            "and",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/legal/terms",
                target: "_blank",
                className: "text-blue-600 hover:underline",
                onClick: (e) => e.stopPropagation(),
                children: "Terms of Service"
              }
            ),
            "."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "w-full",
              disabled: status === "loading" || !formData.consent,
              children: status === "loading" ? "Sending..." : "Send Invitation"
            }
          ),
          status === "error" && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-2", children: "Please use your work email. Free email providers are not allowed." })
        ] })
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
</li> </ul> </div> <div class="flex flex-col gap-4 text-center"> <div> <h4 class="text-4xl font-bold">$268/hr</h4> </div> ${renderComponent($$result2, "SlackConnectDialog", SlackConnectDialog, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/slack-connect-dialog", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` <button${addAttribute(cn(buttonVariants({ size: "lg" })), "class")} id="slack-connect-button"> ${renderComponent($$result3, "Icon", $$Icon, { "name": "lucide:slack", "class": "mr-2 size-4" })} <span class="text-xs">Start Trial</span> </button> ` })} </div> </div> <!-- <div
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

export { $$Pricing as default, $$file as file, $$url as url };
