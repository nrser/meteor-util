import tcomb from 'tcomb';
import type { $Refinement } from 'tcomb';
import * as nrser from 'nrser';
import { Component, PropTypes as ReactPropTypes } from 'react';

export const ComponentClass = nrser.t.subclassOf(Component);

export const ID_LENGTH = 17;

function isId(value) {
  return (typeof value === 'string') && (value.length === ID_LENGTH);
}

// doesn't fucking work and defaults to 't.All'
export type Id = string & $Refinement<typeof isId>;
