import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import templateParserPkg from '@angular-eslint/template-parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const {parser: templateParser} = templateParserPkg;

export default [
  // Commonly ignores
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'coverage/**',
      '**/*.js',
      '**/*.mjs'
    ],
  },

  {
    files: ['**/*.js', '**/*.mjs'],
    ...js.configs.recommended
  },
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.ts'],
    plugins: {
      '@angular-eslint': angular,
      '@typescript-eslint': tseslint.plugin,
      prettier: prettier,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Prettier
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // Angular
      '@angular-eslint/directive-selector': [
        'error',
        {type: 'attribute', prefix: 'app', style: 'camelCase'},
      ],
      '@angular-eslint/component-selector': [
        'error',
        {type: 'element', prefix: 'app', style: 'kebab-case'},
      ],
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow', trailingUnderscore: 'allow'},
        {selector: 'variable', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow'},
        {selector: 'typeLike', format: ['PascalCase']},
        {selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE']},
      ],

      // General
      'max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-console': ['warn', {allow: ['warn', 'error']}],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Allow snake_case and hyphens in API models
  {
    files: ['src/app/core/models/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off'
    }
  },

  // Allow snake_case and hyphens in API constants
  {
    files: ['src/app/core/constants/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': 'off'
    }
  },

  // Rules for test files
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off'
    }
  },

  {
    files: ['**/directives/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow', trailingUnderscore: 'allow'},
        {selector: 'variable', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow'},
        {selector: 'typeLike', format: ['PascalCase']},
        {selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE']},
        {selector: 'objectLiteralProperty', format: null, filter: {regex: '^\\[', match: true}}
      ],
    }
  },

  {
    files: ['**/*.html'],
    ignores: ['**/*.html'],
  },
];
