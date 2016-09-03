import tcomb from 'tcomb';
import type { $Refinement } from 'tcomb'
import * as nrser from 'nrser';
import { Component } from 'react';

export const ComponentType = nrser.t.subclassOf(Component);

function isId(string) {
  return string.length === 17;
}

export type Id = string & $Refinement<typeof isId>;
