module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node ./performance/serve-for-lighthouse.cjs',
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
      startServerReadyPattern: 'Server is ready to handle requests',
      startServerReadyTimeout: 120000,
    }, assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.8}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'total-blocking-time': ['error', {maxNumericValue: 300}],
        'first-contentful-paint': ['error', {maxNumericValue: 1800}],
        'speed-index': ['error', {maxNumericValue: 3400}],
        'interactive': ['error', {maxNumericValue: 3800}],
        'server-response-time': ['error', {maxNumericValue: 600}],
        'first-meaningful-paint': ['error', {maxNumericValue: 2000}],
        'max-potential-fid': ['error', {maxNumericValue: 130}],

        // resources
        'total-byte-weight': ['error', {maxNumericValue: 1600000}], // 1.6MB
        'unused-javascript': ['warning', {maxNumericValue: 1000}],
        'uses-responsive-images': ['warning', {minScore: 0.8}],
        'uses-text-compression': ['error', {minScore: 1}],

        // best
        'uses-rel-preconnect': ['warning', {minScore: 1}],
        'uses-rel-preload': ['warning', {minScore: 1}],
        'font-display': ['warning', {minScore: 1}],
        'offscreen-images': ['warning', {minScore: 1}],

        // access
        'categories:accessibility': ['warning', {minScore: 0.9}],
      },
    }, upload: {
      target: 'temporary-public-storage',
    },
  },
}
