/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="simple-stack-form/types" />
/// <reference types="../.astro/svg.d.ts" />

  declare namespace App {
    interface Locals {
      platform: {
        env: {
          SLACK_BOT_TOKEN: string;
          HUBSPOT_ACCESS_TOKEN: string;
        };
      };
    }
  }