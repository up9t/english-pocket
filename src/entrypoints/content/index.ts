import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: "ui",
  async main(ctx) {

    const vuetify = createVuetify({
      components,
      directives,
      theme: {
        scope: "#english-pocket-container"
      }
    })

    const ui = await createShadowRootUi(ctx, {
      name: 'english-pocket',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = createApp(App);
        app.use(vuetify);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        app?.unmount();
      },
    });

    ui.mount();
  },
});
