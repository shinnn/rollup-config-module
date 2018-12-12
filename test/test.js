'use strict';

const {join} = require('path');
const {unlink, readFile} = require('fs').promises;

const rollupCofigModule = require('..');
const {rollup} = require('rollup');
const test = require('tape');

const {input, output, plugins} = rollupCofigModule;

async function getRollupResult(dir) {
	const absoluteDir = join(__dirname, `fixture-${dir}`);
	const builtFilePath = join(absoluteDir, 'index.js');

	try {
		await unlink(builtFilePath);
	} catch {}

	process.chdir(absoluteDir);
	await (await rollup({input, plugins})).write(output);
	return readFile(builtFilePath, 'utf8');
}

test('rollup-config-module', async t => {
	t.deepEqual(
		Object.keys(rollupCofigModule),
		['input', 'output', 'plugins'],
		'should have 3 fields `input`, `output` and `plugins`.'
	);

	t.equal(
		await getRollupResult('nameless-function'),
		`'use strict';

var fs = require('fs');
var random = require('lodash/random');

var filename = 'tmp';

module.exports = options => {
	fs.writeFileSync(filename, random(), options);
};
`,
		'should compile an ES module to a CommonJS module.'
	);

	t.equal(
		await getRollupResult('named-function'),
		`'use strict';

module.exports = function aNamedFunction() {
	return 'Hello';
}
`,
		'should keep the original function name.'
	);

	t.equal(
		await getRollupResult('no-function'),
		'module.exports = true;\n',
		'should remove unnecessary strict mode invocation.'
	);

	t.equal(
		await getRollupResult('no-default-export'),
		`'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function x() {
	return 'x';
}

exports.x = x;
`,
		'should support a module with no default export.'
	);

	t.equal(
		await getRollupResult('export-referred-before'),
		'var arr = [1];\narr.ushift(Math.random());\n\nmodule.exports = arr;\n',
		'should leave a variable declaration as is when the variable is referred before it\'s exported.'
	);

	t.equal(
		await getRollupResult('uninitialized-export'),
		'var x;\n\nmodule.exports = x;\n',
		'should support a module exporting a variable with no initial value.'
	);

	t.end();
});
