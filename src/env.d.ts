/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="simple-stack-form/types" />
/// <reference types="../.astro/svg.d.ts" />

interface ImportMetaEnv {
    readonly SLACK_BOT_TOKEN: string;
    readonly HUBSPOT_ACCESS_TOKEN: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }