'use strict';

const {join} = require('path');
const {promisify} = require('util');

const mkdirp = require('mkdirp');
const readUtf8File = require('read-utf8-file');
const rollupCofigModule = require('.');
const {rollup} = require('rollup');
const test = require('tape');

const expected = `'use strict';

var fs = require('fs');
var random = require('lodash/random');

var filename = 'tmp';

var index = options => {
	fs.writeFileSync(filename, random(), options);
};

module.exports = index;
`;

test('rollup-config-module', async t => {
	const bundle = await rollup({
		input: rollupCofigModule.input
	});

	t.deepEqual(
		Object.keys(rollupCofigModule),
		['input', 'output'],
		'should have 2 fields `input` and `output`.'
	);

	const tmp = join(__dirname, 'tmp');

	await promisify(mkdirp)('tmp');
	process.chdir(tmp);
	await bundle.write(rollupCofigModule.output);

	t.equal(
		await readUtf8File(join(tmp, 'index.js')),
		expected,
		'should be a valid Rollup config.'
	);

	t.end();
});
