import { s as createComponent, t as renderTemplate, u as renderComponent, v as maybeRenderHead } from './astro/server_C2DrDyYu.mjs';
import { $ as $$MainLayout } from './main-layout_D8Sy9k_x.mjs';

const $$Referral = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Pricing", "mainClass": "flex-1 bg-background-200" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24"> <div class="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]"> <h2 class="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
Get $200 when you refer customers to Portcullis
</h2> <p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
We love our community and supporters and want to show appreciation when you refer customers to us
</p> </div> <div class="grid w-full items-start gap-10 rounded-3xl overflow-hidden border p-10 md:grid-cols-[1fr_200px] bg-background">
If you know someone who would be a good fit to benefit from our hourly Clickhouse support, shoot an email to referrals@runportcullis.co with relevant information.
</div> <!-- <div
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
}, "/Users/jdbohrman/www.runportcullis.co/src/pages/referral.astro", void 0);

const $$file = "/Users/jdbohrman/www.runportcullis.co/src/pages/referral.astro";
const $$url = "/referral";

export { $$Referral as default, $$file as file, $$url as url };
