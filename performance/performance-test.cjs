const puppeteer = require('puppeteer')
const {spawn} = require('child_process')

const server = spawn('node', ['./performance/serve-for-lighthouse.cjs'], {
  stdio: 'inherit',
})

setTimeout(async () => {
  try {
    const browser = await puppeteer.launch({
      args: ['--disable-cache', '--disk-cache-size=1'],
    })
    const page = await browser.newPage()

    const client = await page.createCDPSession()
    await client.send('Network.enable')
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 150, // 150ms задержка
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6Mbps
      uploadThroughput: 750 * 1024 / 8, // 750Kbps
    })

    await page.evaluateOnNewDocument(() => {
      let lcpValue

      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        lcpValue = lastEntry.startTime
      }).observe({type: 'largest-contentful-paint', buffered: true})

      let clsValue = 0
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
      }).observe({type: 'layout-shift', buffered: true})

      window.getLCP = () => lcpValue
      window.getCLS = () => clsValue
    })

    await page.goto('http://localhost:4174', {waitUntil: 'networkidle0'})

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)))

    const performanceMetrics = await page.evaluate(() => {
      // Используем PerformanceNavigationTiming вместо устаревшего performance.timing
      const navEntry = performance.getEntriesByType('navigation')[0]

      return {
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: window.getLCP(),
        cls: window.getCLS(), // Современный подход для TTI и loadTime
        tti: navEntry ? navEntry.domInteractive : undefined,
        loadTime: navEntry ? navEntry.loadEventEnd : undefined, // Можно добавить и другие полезные метрики
        ttfb: navEntry ? navEntry.responseStart : undefined,
        domContentLoaded: navEntry ? navEntry.domContentLoadedEventEnd : undefined,
      }
    })

    await browser.close()

    // Проверяем метрики
    let failed = false
    const issues = []

    if (!performanceMetrics.fcp) {
      issues.push('FCP не удалось измерить')
    } else if (performanceMetrics.fcp > 2000) {
      issues.push(`FCP (${performanceMetrics.fcp}ms) превышает рекомендуемое значение (2000ms)`)
      failed = true
    }

    if (!performanceMetrics.lcp) {
      issues.push('LCP не удалось измерить')
    } else if (performanceMetrics.lcp > 2500) {
      issues.push(`LCP (${performanceMetrics.lcp}ms) превышает рекомендуемое значение (2500ms)`)
      failed = true
    }

    if (performanceMetrics.cls === undefined) {
      issues.push('CLS не удалось измерить')
    } else if (performanceMetrics.cls > 0.1) {
      issues.push(`CLS (${performanceMetrics.cls}) превышает рекомендуемое значение (0.1)`)
      failed = true
    }

    if (failed) {
      console.error('Performance metrics failed:', performanceMetrics)
      console.error('Issues detected:', issues.join(', '))
      process.exit(1)
    }

    console.log('Performance metrics passed:', performanceMetrics)
  } catch (error) {
    console.error('Тест завершился с ошибкой:', error)
    process.exit(1)
  } finally {
    // Останавливаем сервер
    server.kill()
    process.exit(0)
  }
}, 20000)

// Обработка завершения
process.on('SIGINT', () => {
  server.kill()
  process.exit(0)
})

