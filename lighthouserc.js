export default {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: "npm run start -- --hostname 127.0.0.1 --port=4173",
      startServerReadyPattern: "started server on",
      url: ["http://127.0.0.1:4173/"],
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './reports/lighthouse',
    },
  },
};