export default {

	extends: ['eslint:recommended', 'airbnb-base'],

	env: {
		node: true,
		es6: true,
		mocha: true,
	},

	globals: {
		expect: true,
		sinon: true,
	},

	rules: {
		'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/test/**'] }],

		indent: ['error', 'tab'],
		'no-tabs': ['off'],
		'object-curly-spacing': ['error', 'always'],
		'no-trailing-spaces': ['error'],
		'no-irregular-whitespace': ['error'],
		'no-console': ['off'],
	},
};
