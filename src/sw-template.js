/* eslint-disable no-undef */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);
/* eslint-disable-next-line no-restricted-globals */
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

workbox.loadModule("workbox-background-sync");
const { BackgroundSyncPlugin } = workbox.backgroundSync;
const { NetworkOnly } = workbox.strategies;
const { registerRoute } = workbox.routing;

async function postSuccessMessage(response) {
  /* eslint-disable-next-line no-restricted-globals */
  const clients = await self.clients.matchAll();

  for (const client of clients) {
    // Customize this message format as you see fit.
    client.postMessage({
      type: "REPLAY_SUCCESS",
      url: response.url,
    });
  }
}

async function customReplay() {
  let entry;

  while ((entry = await this.shiftRequest())) {
    try {
      const response = await fetch(entry.request.clone());
      // Optional: check response.ok and throw if it's false if you
      // want to treat HTTP 4xx and 5xx responses as retriable errors.

      postSuccessMessage(response);
    } catch (error) {
      await this.unshiftRequest(entry);

      // Throwing an error tells the Background Sync API
      // that a retry is needed.
      throw new Error("Replaying failed.");
    }
  }
}

const bgSyncPlugin = new BackgroundSyncPlugin("posteos-offline", {
  onSync: customReplay,
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
  new RegExp("https://jsonplaceholder.typicode.com/posts"),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);
