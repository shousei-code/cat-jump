import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  test: { include: ["src/**/*.test.ts"] },
  server: { port: 5173, strictPort: true },
  build: { sourcemap: false },
});
