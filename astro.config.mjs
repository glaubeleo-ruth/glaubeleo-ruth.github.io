// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  // Pages stay static by default; /dashboard and its API routes opt out with `prerender = false`.
  adapter: vercel(),
  env: {
    schema: {
      NOTION_DASHBOARD_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      DASHBOARD_PASSWORD: envField.string({ context: "server", access: "secret", optional: true }),
      DASHBOARD_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
