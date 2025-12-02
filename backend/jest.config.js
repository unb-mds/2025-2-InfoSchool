export default {
    transform: {},
    testEnvironment: 'node',
    verbose: true,
    coverageProvider: 'v8',
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/services/bigQueryServices.js",
        "!src/services/vectorStoreServices.js",
    ],
    coverageReporters: ["text", "lcov"]
};
