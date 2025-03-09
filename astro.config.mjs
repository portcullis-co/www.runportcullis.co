// astro.config.mjs

import db from "@astrojs/db";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import netlify from '@astrojs/netlify';
import node from '@astrojs/node';
import clerk from '@clerk/astro';
import path from 'path';

export default defineConfig({
  site: 'https://www.runportcullis.co',
  output: "server",
  adapter: netlify(),
  integrations: [
    clerk(),
    react({
      include: ['**/*.{jsx,tsx}'],
    }),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "github-dark-dimmed" },
      gfm: true,
    }),
    icon(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
    simpleStackForm(),
  ],
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'],
      external: ['@slack/web-api', '@hubspot/api-client']
    },
    resolve: {
      alias: {
        'node:path': 'path-browserify',
        'node:buffer': 'buffer',
        'node:stream': 'stream-browserify',
        'realtime-ai': path.resolve('./src/lib/realtime-ai-proxy.ts'),
        'realtime-ai-react': path.resolve('./src/lib/realtime-ai-react-proxy.ts')
      }
    },
    optimizeDeps: {
      include: ['realtime-ai', 'realtime-ai-react'],
      exclude: ['@slack/web-api', '@hubspot/api-client'],
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  },
});