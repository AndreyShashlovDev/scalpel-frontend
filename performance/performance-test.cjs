const puppeteer = require('puppeteer')
const {spawn} = require('child_process')

function startServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['./performance/serve-for-lighthouse.cjs'], {
      stdio: ['inherit', 'pipe', 'inherit'],
    })

    const timeout = setTimeout(() => {
      server.kill()
      reject(new Error('Server did not start within 2 minutes'))
    }, 120000)

    server.stdout.on('data', (data) => {
      const output = data.toString()
      console.log(output)

      if (output.includes('Server is ready to handle requests') || output.includes('Local:') || output.includes('ready in')) {
        clearTimeout(timeout)
        resolve(server)
      }
    })

    server.on('error', (err) => {
      clearTimeout(timeout)
      reject(err)
    })

    server.on('close', (code) => {
      if (code !== 0 && code !== null) {
        clearTimeout(timeout)
        reject(new Error(`Server terminated with code ${code}`))
      }
    })
  })
}

async function runPerformanceTest() {
  let server

  try {
    console.log('Starting server...')
    server = await startServer()
    console.log('Server started and ready')

    const browser = await puppeteer.launch({
      args: ['--disable-cache', '--disk-cache-size=1'],
    })
    const page = await browser.newPage()

    const client = await page.createCDPSession()
    await client.send('Network.enable')
    await client.send('Network.emulateNetworkConditions', {
      offline: false, latency: 150, // 150ms delay
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

      window.clsEntries = []
      window.clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.clsEntries.push(entry)
          }
        }
      })
      window.clsObserver.observe({type: 'layout-shift', buffered: true})

      window.getLCP = () => lcpValue
      window.getCLS = () => {
        return window.clsEntries.reduce((sum, entry) => sum + entry.value, 0)
      }
    })

    console.log('Navigating to page...')
    await page.goto('http://localhost:4173', {waitUntil: 'networkidle0'})

    console.log('Waiting for layout shifts (5 seconds)...')
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)))

    await page.mouse.move(100, 100)
    await page.mouse.move(200, 200)

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)))

    const performanceMetrics = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType('navigation')[0]

      return {
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        lcp: window.getLCP(),
        cls: window.getCLS(),
        tti: navEntry ? navEntry.domInteractive : undefined,
        loadTime: navEntry ? navEntry.loadEventEnd : undefined,
        ttfb: navEntry ? navEntry.responseStart : undefined,
        domContentLoaded: navEntry ? navEntry.domContentLoadedEventEnd : undefined,
      }
    })

    await browser.close()

    let failed = false
    const issues = []

    if (!performanceMetrics.fcp) {
      issues.push('FCP could not be measured')
    } else if (performanceMetrics.fcp > 2000) {
      issues.push(`FCP (${performanceMetrics.fcp}ms) exceeds recommended value (2000ms)`)
      failed = true
    }

    if (!performanceMetrics.lcp) {
      issues.push('LCP could not be measured')
    } else if (performanceMetrics.lcp > 2500) {
      issues.push(`LCP (${performanceMetrics.lcp}ms) exceeds recommended value (2500ms)`)
      failed = true
    }

    if (performanceMetrics.cls === undefined) {
      issues.push('CLS could not be measured')
    } else if (performanceMetrics.cls > 0.1) {
      issues.push(`CLS (${performanceMetrics.cls}) exceeds recommended value (0.1)`)
      failed = true
    }

    if (failed) {
      console.error('Performance metrics failed:', performanceMetrics)
      console.error('Issues detected:', issues.join(', '))
      process.exit(1)
    }

    console.log('Performance metrics passed:', performanceMetrics)
    return 0
  } catch (error) {
    console.error('Test finished with an error:', error)
    return 1
  } finally {
    if (server) {
      server.kill()
    }
  }
}

runPerformanceTest().then(exitCode => {
  process.exit(exitCode)
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, terminating...')
  process.exit(0)
})
