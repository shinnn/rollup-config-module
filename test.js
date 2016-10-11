'use strict';

const rollupStream = require('rollup-stream');
const simpleConcat = require('simple-concat');
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

test('rollup-config-module', t => {
  t.plan(2);

  simpleConcat(rollupStream(require.resolve('.')), (err, buf) => {
    t.strictEqual(err, null, 'should be used as a Rollup config.');
    t.strictEqual(String(buf), expected, 'should omit interoperable loading helper from output.');
  });
});
