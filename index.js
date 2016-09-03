export * from 'nrser';
export * from './errors.js';
export * from './check.js';
export * from './setting.js';

import tcomb from 'tcomb';
import * as nrser from 'nrser';

/**
* extend tcomb and nrser's types with meteor / react stuff.
*/
export const types = {
  ...tcomb,
  ...nrser.types,
  ...require('./types'),
}

export const t = types;