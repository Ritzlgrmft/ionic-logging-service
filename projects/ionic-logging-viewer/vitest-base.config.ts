import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            "ionic-logging-service": resolve(__dirname, "../../dist/ionic-logging-service"),
        },
    },
});
