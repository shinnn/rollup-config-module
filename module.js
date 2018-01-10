import {writeFileSync} from 'fs';
import random from 'lodash/random';
import filename from './another-module.js';

export default options => {
	writeFileSync(filename, random(), options);
};
