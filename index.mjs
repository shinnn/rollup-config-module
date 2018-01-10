import {writeFileSync} from 'fs';
import random from 'lodash/random';
import filename from './external-module.mjs';

export default options => {
	writeFileSync(filename, random(), options);
};
