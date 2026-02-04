// Jest Configuration for KNOUX Player X
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.test.ts',
        '**/tests/**/*.test.tsx'
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts'
    ],
    coverageDirectory: '<rootDir>/coverage',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    verbose: true
};
