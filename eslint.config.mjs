import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tsPlugin from 'typescript-eslint';
import angular from 'angular-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tsPlugin.configs.recommended,
    tsPlugin.configs.stylistic,
    angular.configs.tsRecommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: new URL('.', import.meta.url).pathname,
            },
        },
        rules: {
            "@angular-eslint/component-class-suffix": [
                "error",
                {
                    "suffixes": [
                        "Component",
                        "Page"
                    ]
                }
            ],
            "@typescript-eslint/no-explicit-any": "off",
        }
    },
);