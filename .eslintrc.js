module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    'globals': {
        'HandwrittenBoard': true
    },
    rules: {
        'no-irregular-whitespace':'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'comma-dangle': [2, 'never'],
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
