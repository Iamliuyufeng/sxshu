module.exports = {
    root: true,
    extends: '../../.eslintrc',
    globals: {
        PROJECT_VERSION: 'readonly'
    },
    rules: {
        camelcase: 'off',
        'no-prototype-builtins': 'off',
        'max-len': 'off',
        'no-useless-backreference': 'off',
        'no-extend-native': 0,
        'no-shadow': 0,
        'no-undef': 0,
        'react/jsx-no-undef': 0,
        'no-new-func': 0,
        'no-eval': 0,
        'react-hooks/rules-of-hooks': 0,
        'prefer-promise-reject-errors': 0,
        'react/react-in-jsx-scope': 0,
        'react/no-children-prop': 0
    }
};
