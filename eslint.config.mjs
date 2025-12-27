import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    angular.configs.tsRecommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
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