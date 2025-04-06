function forceAppReload() {
  const params = new URLSearchParams(window.location.search)
  const retry = params.get('retry')
  const redirect = params.get('redirect')

  if (retry === '1') {
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))),
      'serviceWorker' in navigator
        ? navigator.serviceWorker.getRegistration().then(reg => reg?.unregister())
        : Promise.resolve()
    ]).then(() => {
      console.log('[PWA] Update complete. Redirecting back to page...')
      window.location.href = redirect || '/'
    })
  }
}

window.addEventListener('error', (event) => {
  const target = event.target as HTMLElement

  if (target?.tagName === 'SCRIPT') {
    const alreadyRetrying = window.location.search.includes('retry=1')
    if (alreadyRetrying) {
      return
    }

    const redirect = window.location.pathname + window.location.search
    const reloadUrl = `/index.html?retry=1&redirect=${encodeURIComponent(redirect)}`
    console.warn('[PWA] Error loading script detected. Starting update...')
    window.location.href = reloadUrl
  }
}, true)

forceAppReload()
