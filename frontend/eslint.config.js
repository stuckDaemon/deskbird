const { FlatCompat } = require('@eslint/eslintrc');
const angularEslintPlugin = require('@angular-eslint/eslint-plugin');
const angularEslintTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const prettierPlugin = require('eslint-plugin-prettier');

const compat = new FlatCompat();

module.exports = [
  ...compat.extends('plugin:@angular-eslint/recommended'),
  ...compat.extends('plugin:@angular-eslint/template/process-inline-templates'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      '@angular-eslint/template': angularEslintTemplatePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      'prettier/prettier': 'error',
    },
  },
];
