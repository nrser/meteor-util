/**
* extending meteor's check function to include the value that failed in
* the error and define some helper utils
*/

import { _ } from 'meteor/underscore';
import { check as meteorCheck, Match as MeteorMatch } from 'meteor/check';
import { UtilError } from './errors';

import * as Util from '.';

export const Match = {};

_.extend(Match, MeteorMatch);

/**
* the error *we* throw when a check fails
* ours has the value that failed attached.
*/
export class CheckError extends UtilError {}

export function check(value, pattern) {
  try {
    meteorCheck(value, pattern);
  } catch (error) {
    throw new CheckError(
      error.message + Util.j` (value=${ value }, pattern=${ pattern })`
    );
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
  
  throw new CheckError("instance match failed", {
    value,
    patterns: _.map(patterns, pattern => pattern[0]),
  });
}

Match.NotEmpty = Match.Where(function(value) {
  return !_.isEmpty(value);
});
Match.NotEmpty.name = 'NotEmpty';

Match.NonEmptyString = Match.Where(function(value) {
  return _.isString(value) && !_.isEmpty(value);
})
Match.NonEmptyString.name = "NonEmptyString";

Match.PositiveInteger = Match.Where(function(value) {
  return (Match.test(value, Match.Integer) && value > 0);
});
Match.PositiveInteger.name = "PositiveInteger";
