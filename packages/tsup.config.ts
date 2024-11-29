import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "msw"],
  outDir: "dist",
  treeshake: true,
  splitting: true,
  minify: true,
  injectStyle: true,
  loader: {
    ".css": "css",
  },
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
