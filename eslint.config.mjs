import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    },
    {
        ignores: ['**/*.d.ts'],
    },
    {
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 5,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        settings: {
            react: {
                version: '18.3.1',
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    pluginReact.configs.flat.recommended,
    eslintPluginPrettierRecommended,
    sonarjs.configs.recommended,
    ...compat.extends('plugin:react-hooks/recommended'),
    {
        rules: {
            'react/jsx-no-undef': 'off',
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    disallowTypeAnnotations: false,
                    fixStyle: 'inline-type-imports',
                },
            ],
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                {
                    allowNullableObject: true,
                    allowString: true,
                    allowNullableString: true,
                },
            ],
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/dot-notation': [
                'error',
                { allowIndexSignaturePropertyAccess: true },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unnecessary-type-parameters': 'off',
            'sonarjs/void-use': 'off',
        },
    },
];
