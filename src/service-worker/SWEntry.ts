import { precacheAndRoute } from 'workbox-precaching'
import { setup as webPushSetup } from './modules/WebPush.ts'

declare const self: ServiceWorkerGlobalScope

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('wss://') || event.request.url.startsWith('ws://')) {
    return
  }
})

precacheAndRoute(self.__WB_MANIFEST)

webPushSetup(self)

self.addEventListener('install', () => {
  self.skipWaiting()
    .catch(e => console.error(e))
})

self.addEventListener('activate', (event) => {
  try {
    event.waitUntil(clients.claim().catch(e => console.error(e)))
  } catch (e) {
    console.error(e)
  }
})
