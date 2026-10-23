import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

module.exports = defineConfig({
    plugins: [react()],
    build: {
        // Avoid requiring Vite's optional native CSS minifier in local setups.
        cssMinify: false
    }
});
