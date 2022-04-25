module.exports = async () => {
    return {
        bail: 3,
        clearMocks: true,
        "collectCoverageFrom": [
            "**/*.{js,jsx}",
        ],
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