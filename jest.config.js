module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    detectOpenHandles: false,
    testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
    /*globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json'
        }
    }*/
    transform: {
        '^.+\\.{ts|tsx}?$': ['ts-jest', {
            tsConfig: 'tsconfig.json',
    }]
}
}