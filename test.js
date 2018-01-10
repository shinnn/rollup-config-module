'use strict';

const {join} = require('path');
const {promisify} = require('util');

const mkdirp = require('mkdirp');
const omit = require('lodash/fp/omit');
const readUtf8File = require('read-utf8-file');
const rollupCofigModule = require('.');
const {rollup} = require('rollup');
const test = require('tape');

const expected = `'use strict';

var fs = require('fs');
var random = require('lodash/random');

var filename = 'tmp';

var module$1 = options => {
	fs.writeFileSync(filename, random(), options);
};

module.exports = module$1;
`;

test('rollup-config-module', async t => {
	const bundle = await rollup({
		input: rollupCofigModule.input
	});

	t.deepEqual(
		Object.keys(rollupCofigModule),
		['input', 'file', 'format', 'interop'],
		'should have 4 fields: `input`, `file`, `format` and `interop`.'
	);

	const tmp = join(__dirname, 'tmp');

	await promisify(mkdirp)('tmp');
	process.chdir(tmp);
	await bundle.write(omit(['input'])(rollupCofigModule));

	t.equal(
		await readUtf8File(join(tmp, 'index.js')),
		expected,
		'should be a valid Rollup config.'
	);

	t.end();
});
