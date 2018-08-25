'use strict';

const {join} = require('path');
const {promisify} = require('util');
const {mkdir, readFile} = require('fs');

const rimraf = require('rimraf');
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
const tmp = join(__dirname, 'tmp');

test('rollup-config-module', async t => {
	const bundle = await rollup({
		input: rollupCofigModule.input
	});

	t.deepEqual(
		Object.keys(rollupCofigModule),
		['input', 'output'],
		'should have 2 fields `input` and `output`.'
	);

	await promisify(rimraf)(tmp);
	await promisify(mkdir)(tmp);
	process.chdir(tmp);
	await bundle.write(rollupCofigModule.output);

	t.equal(
		await promisify(readFile)(join(tmp, 'index.js'), 'utf8'),
		expected,
		'should be a valid Rollup config.'
	);

	t.end();
});
