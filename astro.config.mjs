import db from "@astrojs/db";
import mdx from "@astrojs/mdx";
import { netlifyFunctions } from "@astrojs/netlify/functions";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";

// https://astro.build/config
export default defineConfig({
  site: "https://www.getportcullis.co",
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark-dimmed",
      },
      gfm: true,
    }),
    icon(),
    sitemap(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    simpleStackForm(),
  ],
  output: "hybrid",
  adapter: netlifyFunctions({
    dist: new URL('./dist/', import.meta.url),
    functionPerRoute: true, // Create a separate function for each route
    edge: false // Disable edge functions
  }),
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js', 'discord.js', 'color.js']
    },
    optimizeDeps: {
      exclude: ['@supabase/supabase-js', 'discord.js']
    }
  }
});