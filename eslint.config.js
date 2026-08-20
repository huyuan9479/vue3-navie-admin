import { defineConfig } from "@soybeanjs/eslint-config-vue";

export default defineConfig({
  "vue/no-unused-emit-declarations": "off",
  "vue/first-attribute-linebreak": "off",
  "vue/html-indent": "off",
  "vue/html-closing-bracket-newline": "off",
  "vue/component-name-in-template-casing": [
    "warn",
    "PascalCase",
    {
      registeredComponentsOnly: false,
      ignores: ["/^icon-/"],
    },
  ],
});
