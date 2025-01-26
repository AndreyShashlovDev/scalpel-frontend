import { useEffect } from 'react'

const GTagAnalytics = () => {
  useEffect(() => {
    let gtagScript: any

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
        // @ts-ignore
        window.dataLayer = window.dataLayer || []

        // @ts-ignore
        window.gtag = function gtag() {
          // @ts-ignore
          window.dataLayer.push(arguments)
        }

        // @ts-ignore
        window.gtag('js', new Date())
        // @ts-ignore
        window.gtag('config', 'G-ZZXEYG66VZ')
      }

      gtagScript.onerror = () => {
        console.error('Error loading Google Tag Manager script.')
      }

      document.body.appendChild(gtagScript)
    } catch (e) {
      console.error(e)
    }

    return () => {
      document.body.removeChild(gtagScript)
    }
  }, [])

  return <></>
}

export default GTagAnalytics
