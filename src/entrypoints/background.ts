export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === "open_new_window") {
      const data = message?.data as Browser.windows.CreateData | null; 

      if (!data) return; 

      const window = browser.windows.create(data).catch(err => err);

      if (window instanceof Error) {
          console.error("failed to create window: ", window);
          return
      }
    }
  })
});
