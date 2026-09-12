// import { defineConfig } from '@soybeanjs/eslint-config-vue';

//#region src/shared.ts
async function interopDefault(m) {
  const resolved = await m;
  return resolved.default || resolved;
}

//#endregion
//#region src/index.ts
async function defineConfig(overrides) {
  const [pluginVue, parserVue, pluginTs] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('@typescript-eslint/eslint-plugin'))
  ]);
  const { rules: recommendedRules } =
    pluginTs.configs['eslint-recommended'].overrides[0];
  const tsRules = {
    ...pluginTs.configs.base.rules,
    ...recommendedRules,
    ...pluginTs.configs.strict.rules,
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false
      }
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      { allowSingleExtends: true }
    ],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'all',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true
      }
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/unified-signatures': 'off'
  };
  const vueRules = ['essential', 'strongly-recommended', 'recommended'].reduce(
    (preRules, key) => {
      const config = pluginVue.configs[key];
      return {
        ...preRules,
        ...config.rules
      };
    },
    {}
  );
  return [
    { plugins: { vue: pluginVue } },
    {
      files: ['**/*.vue'],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          extraFileExtensions: ['.vue'],
          parser: '@typescript-eslint/parser',
          sourceType: 'module'
        }
      },
      processor: pluginVue.processors['.vue'],
      plugins: { '@typescript-eslint': pluginTs },
      rules: {
        ...tsRules,
        ...pluginVue.configs.base.rules,
        ...vueRules,
        'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
        'vue/component-api-style': ['warn', ['script-setup', 'composition']],
        'vue/component-name-in-template-casing': [
          'warn',
          'PascalCase',
          {
            registeredComponentsOnly: false,
            ignores: []
          }
        ],
        'vue/component-options-name-casing': ['warn', 'PascalCase'],
        'vue/custom-event-name-casing': ['warn', 'camelCase'],
        'vue/define-emits-declaration': ['warn', 'type-based'],
        'vue/define-macros-order': 'off',
        'vue/define-props-declaration': ['warn', 'type-based'],
        'vue/html-comment-content-newline': 'warn',
        'vue/html-self-closing': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/next-tick-style': ['warn', 'promise'],
        'vue/no-duplicate-attr-inheritance': 'warn',
        'vue/no-required-prop-with-default': 'warn',
        'vue/no-reserved-component-names': 'off',
        'vue/no-static-inline-styles': 'off',
        'vue/no-template-target-blank': 'error',
        'vue/no-this-in-before-route-enter': 'error',
        'vue/no-undef-properties': 'warn',
        'vue/no-unsupported-features': 'warn',
        'vue/no-unused-emit-declarations': 'warn',
        'vue/no-unused-properties': 'warn',
        'vue/no-unused-refs': 'warn',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-useless-mustaches': 'warn',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-text': 'warn',
        'vue/padding-line-between-blocks': 'warn',
        'vue/prefer-define-options': 'warn',
        'vue/prefer-separate-static-class': 'warn',
        'vue/prop-name-casing': ['warn', 'camelCase'],
        'vue/require-macro-variable-name': [
          'warn',
          {
            defineProps: 'props',
            defineEmits: 'emit',
            defineSlots: 'slots',
            useSlots: 'slots',
            useAttrs: 'attrs'
          }
        ],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/valid-define-options': 'warn',
        'vue/valid-v-slot': 'off',
        ...overrides
      }
    }
  ];
}

export default defineConfig({
  'vue/no-unused-emit-declarations': 'off',
  'vue/first-attribute-linebreak': 'off',
  'vue/html-indent': 'off',
  'vue/html-closing-bracket-newline': 'off',
  'vue/component-name-in-template-casing': [
    'warn',
    'PascalCase',
    {
      registeredComponentsOnly: false,
      ignores: ['/^icon-/']
    }
  ]
});
