import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test-setup.ts"],
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./test-results.xml",
        },
    },
});
