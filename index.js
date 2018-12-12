'use strict';

const {Linter} = require('eslint');

const linter = new Linter();
const linterConfig = {
	parserOptions: {
		ecmaVersion: 10
	},
	env: {
		browser: true,
		node: true,
		worker: true,
		serviceworker: true
	},
	rules: {
		'no-undef': 'error'
	}
};

module.exports = {
	input: 'index.mjs',
	output: {
		file: 'index.js',
		format: 'cjs',
		interop: false
	},
	plugins: [
		{
			name: 'remove-unnecessary-use-strict-and-reduce-unnecessary-reassign',
			generateBundle(outputOptions, {'index.js': generated}) {
				let {code} = generated;

				if (!code.includes('function') && !code.includes('=>')) {
					code = code.replace(/^'use strict';\n*/u, '');
					generated.code = code;
				}

				const matchedModuleExports = /\nmodule\.exports = (\w+);\n/u.exec(code);

				if (!matchedModuleExports) {
					return;
				}

				code = `${code.substring(0, matchedModuleExports.index)}${code.substring(matchedModuleExports.index + matchedModuleExports[0].length)}`;
				const matchedDeclaration = new RegExp(`^(var ${matchedModuleExports[1]} = |(?=function ${matchedModuleExports[1]}\\())`, 'um').exec(code);

				if (!matchedDeclaration) {
					return;
				}

				code = `${code.substring(0, matchedDeclaration.index)}module.exports = ${code.substring(matchedDeclaration.index + matchedDeclaration[0].length)}`;

				if (linter.verify(code, linterConfig).length !== 0) {
					return;
				}

				generated.code = code;
			}
		}
	]
};
