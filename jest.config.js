module.exports = async () => {
    return {
        bail: 3,
        clearMocks: true,
        collectCoverageFrom: [
            "packages/**/src/**.{js,jsx,ts,tsx}"
        ],
        coverageThreshold: {
            global: {
              lines: 4,
            },
        },
        collectCoverage: true,
        mapCoverage: true,
        verbose: true,
        moduleFileExtensions: ['js', 'ts', 'tsx'],
        preset: "ts-jest",
        transform: {
            '^.+\\.ts?$': 'ts-jest'
        },
        testEnvironment: "jsdom"
    };
};