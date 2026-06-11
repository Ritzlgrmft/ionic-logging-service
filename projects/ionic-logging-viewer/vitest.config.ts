import { defineConfig, Plugin } from "vitest/config";
import { resolve, dirname } from "path";
import { readFileSync } from "fs";
import ts from "typescript";

function angularTemplateInliner(): Plugin {
    return {
        name: "angular-template-inliner",
        enforce: "pre",
        transform(code, id) {
            if (!id.endsWith(".ts") || !code.includes("templateUrl")) return null;

            let transformed = code.replace(
                /templateUrl:\s*['"](.+?)['"]/g,
                (_match, templatePath) => {
                    const absPath = resolve(dirname(id), templatePath);
                    const content = readFileSync(absPath, "utf-8").replace(/`/g, "\\`").replace(/\$/g, "\\$");
                    return `template: \`${content}\``;
                }
            );

            transformed = transformed.replace(/styleUrls:\s*\[.*?\]/gs, "styles: []");

            return transformed;
        },
    };
}

function angularSignalInputRegistrar(): Plugin {
    return {
        name: "angular-signal-input-registrar",
        enforce: "pre",
        transform(code, id) {
            if (!id.endsWith(".ts")) return null;
            if (!code.includes("= input") && !code.includes("= model")) return null;

            const sourceFile = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);
            const patches: string[] = [];

            function visit(node: ts.Node) {
                if (ts.isClassDeclaration(node) && node.name) {
                    const className = node.name.text;
                    const signalInputs: { name: string; required: boolean }[] = [];

                    for (const member of node.members) {
                        if (!ts.isPropertyDeclaration(member) || !member.initializer) continue;

                        const init = member.initializer;
                        if (!ts.isCallExpression(init)) continue;

                        const expr = init.expression;
                        let isSignalInput = false;
                        let isRequired = false;

                        if (ts.isIdentifier(expr) && (expr.text === "input" || expr.text === "model")) {
                            isSignalInput = true;
                        } else if (
                            ts.isPropertyAccessExpression(expr) &&
                            ts.isIdentifier(expr.expression) &&
                            expr.expression.text === "input" &&
                            ts.isIdentifier(expr.name) &&
                            expr.name.text === "required"
                        ) {
                            isSignalInput = true;
                            isRequired = true;
                        }

                        if (isSignalInput && ts.isIdentifier(member.name)) {
                            signalInputs.push({ name: member.name.text, required: isRequired });
                        }
                    }

                    if (signalInputs.length > 0) {
                        const entries = signalInputs
                            .map(({ name, required }) =>
                                `  "${name}": [{ ngMetadataName: "Input", isSignal: true, alias: "${name}", required: ${required} }]`
                            )
                            .join(",\n");
                        patches.push(`${className}.propMetadata = {\n${entries}\n};`);
                    }
                }
                ts.forEachChild(node, visit);
            }

            visit(sourceFile);

            if (patches.length === 0) return null;
            return `${code}\n${patches.join("\n")}\n`;
        },
    };
}

export default defineConfig({
    plugins: [angularTemplateInliner(), angularSignalInputRegistrar()],
    resolve: {
        alias: {
            "@ionic/core/components": "@ionic/core/components/index.js",
            "ionic-logging-service": resolve(__dirname, "../../dist/ionic-logging-service"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test-setup.ts"],
        server: {
            deps: {
                inline: [/@ionic/],
            },
        },
        reporters: ["default"],
    },
});
