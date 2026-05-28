import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  srcDir: 'src',
  outDir: 'dist',
  manifest: {
    permissions: ["tabs", "storage"],
    browser_specific_settings: {
      gecko: {
        id: "english-pocket@up9t.com",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
});
