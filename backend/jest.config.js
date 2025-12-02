export default {
    transform: {},
    testEnvironment: 'node',
    verbose: true,
    coverageProvider: 'v8',
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/services/dataProcessor.js",
        "src/controllers/chatController.js"
    ],
    coverageReporters: ["text", "lcov"]
};
