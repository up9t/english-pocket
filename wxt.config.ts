import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: ()  => ({
      plugins: [tailwindcss()]
  }),
  modules: ['@wxt-dev/module-vue'],
  srcDir: 'src',
  outDir: 'dist',
  manifest: {
    name: "English Pocket",
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
