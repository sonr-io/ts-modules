module.exports = async () => {
    return {
        bail: 3,
        clearMocks: true,
        collectCoverageFrom: [
            "packages/sonr-webauthn/*/**.{js,jsx,ts,tsx}",
            "packages/sonr-validation/*/**.{js,jsx,ts,tsx}",
        ],
        coverageThreshold: {
            global: {
              lines: 5,
            },
        },
        coverageReporters: ["json", "lcov", "text"],
        coverageDirectory: "./coverage",
        verbose: true,
        moduleFileExtensions: ['js', 'ts', 'tsx'],
        preset: "ts-jest",
        transform: {
            '^.+\\.ts?$': 'ts-jest'
        }
    };
};