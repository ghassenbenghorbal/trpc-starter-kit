import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjs from "vite-plugin-commonjs";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        commonjs({
            filter(id) {
                if (["libs/ckeditor5/build/ckeditor.js"].includes(id)) {
                    return true;
                }
            },
        }),
        ckeditor5({
            theme: "classic",
        }),
    ],
    server: {
        proxy: {
            "/api": {
                target: process.env.NODE_ENV === "development" ? "http://localhost:8000" : "http://localhost:8000",
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "backend": path.resolve(__dirname, "../backend"),
        },
    },
});
