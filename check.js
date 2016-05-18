/**
* extending meteor's check function to include the value that failed in
* the error and define some helper utils
*/

import { _ } from 'meteor/underscore';
import { check as meteorCheck, Match } from 'meteor/check';
import { UtilError } from './errors';

// re-export here for convenience
export { Match } from 'meteor/check';

/**
* the error *we* throw when a match fails, confusingly named the same
* as the one meteor throws, but ours has the value that failed attached.
*/
export class MatchError extends UtilError {}

export function check(value, pattern) {
  try {
    meteorCheck(value, pattern);
  } catch (error) {
    throw new MatchError(error.message, {value});
  }
}

export function match(value, ...patterns) {
  let matched = false;
  let result;
  let i = 0;
  while (!matched && i < patterns.length) {
    const [pattern, handler] = patterns[i];
    check(handler, Function);
    
    if (Match.test(value, pattern)) {
      matched = true;
      result = handler(value);
    }
    
    i++;
  }
  
  if (matched) {
    return result;
  }
  
  throw new MatchError("instance match failed", {
    value,
    patterns: _.map(patterns, pattern => pattern[0]),
  });
}

export const NotEmpty = Match.Where(function(value) {
  return !_.isEmpty(value);
});
