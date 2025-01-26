import { useEffect } from 'react'

const GTagAnalytics = () => {
  useEffect(() => {
    let gtagScript: HTMLScriptElement | undefined

    try {
      if (window.location.hostname === 'localhost') {
        return
      }

      gtagScript = document.createElement('script')
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZZXEYG66VZ'
      gtagScript.defer = true
      gtagScript.async = true

      gtagScript.onload = () => {
        console.log('Google Tag Manager script loaded successfully.')
        // @ts-expect-error ignore
        window.dataLayer = window.dataLayer || []

        // @ts-expect-error ignore
        window.gtag = function gtag() {
          // @ts-expect-error ignore
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer.push(arguments)
        }

        // @ts-expect-error ignore
        window.gtag('js', new Date())
        // @ts-expect-error ignore
        window.gtag('config', 'G-ZZXEYG66VZ')
      }

      gtagScript.onerror = () => {
        console.error('Error loading Google Tag Manager script.')
      }

      document.body.appendChild(gtagScript)
    } catch (e) {
      console.error(e)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    return () => {gtagScript && document.body.removeChild(gtagScript)}
  }, [])

  return <></>
}

export default GTagAnalytics
