'use strict';

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
			generateBundle(outputOptions, bundle) {
				const generated = bundle['index.js'];

				if (!generated.code.includes('function') && !generated.code.includes('=>')) {
					generated.code = generated.code.replace(/^'use strict';\n*/u, '');
				}

				const {code} = generated;
				const matchedModuleExports = /\nmodule\.exports = (\w+);\n/u.exec(code);

				if (!matchedModuleExports) {
					return;
				}

				const newCode = `${code.substring(0, matchedModuleExports.index)}${code.substring(matchedModuleExports.index + matchedModuleExports[0].length)}`;
				const matchedDeclaration = new RegExp(`^(var ${matchedModuleExports[1]} = |(?=function ${matchedModuleExports[1]}\\())`, 'um').exec(newCode);

				if (!matchedDeclaration) {
					return;
				}

				generated.code = `${newCode.substring(0, matchedDeclaration.index)}module.exports = ${newCode.substring(matchedDeclaration.index + matchedDeclaration[0].length)}`;
			}
		}
	]
};
