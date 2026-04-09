import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Explicit roots help when the project path contains spaces (e.g. "Thesis MCP Test")
      allow: [__dirname, path.join(__dirname, "src"), path.join(__dirname, "assets")],
    },
  },
});
