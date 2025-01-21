import db from "@astrojs/db";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.runportcullis.co',
  output: "server",
  adapter: cloudflare({
    mode: 'directory',
    functionPerRoute: true,
    runtime: {
      mode: 'local',
      type: 'pages'
    }
  }),
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "github-dark-dimmed" },
      gfm: true,
    }),
    icon(),
    sitemap(),
    react(),
    tailwind({ applyBaseStyles: false }),
    simpleStackForm(),
  ],
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'],
    },
  },
});