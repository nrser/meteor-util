import tcomb from 'tcomb';
import * as nrser from 'nrser';
import { Component } from 'react';

/**
* extend tcomb and nrser's types with meteor / react stuff.
*/

export const types = {
  ...tcomb,
  ...nrser.types,
  ComponentType: nrser.t.subclassOf(Component),
};

export const t = types;
