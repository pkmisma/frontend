import { defineConfig } from "vite";

// In dev, proxy /api to a locally running backend (npm start in the backend repo)
export default defineConfig({
  server: { proxy: { "/api": "http://localhost:3000" } },
});
