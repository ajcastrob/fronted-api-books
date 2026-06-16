import { defineConfig } from "vite";
import { standardCssModules } from "vite-plugin-standard-css-modules";

export default defineConfig({
  root: "src",
  base: "/fronted-api-books/",
  publicDir: "../public",
  plugins: [standardCssModules()],
  server: { port: 1234 },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      drafts: {
        customMedia: true,
      },
    },
  },
});
