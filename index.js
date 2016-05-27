import { Meteor } from 'meteor/meteor';

import { Logger } from './Logger.js';

export * from './errors.js';
export * from './setting.js';
export * from './Logger.js';
export * from './check.js';
export * from './object.js';

export function indent(str, {amount = 2, indent = null}) {
  indent = indent || new Array(amount + 1).join(' ');
  indent + str.split("\n").join(`\n${ indent }`);
} // indent()

function groupEach(behavior) {
  return (obj, iteratee, context) => {
    const result = {};
    _.each(obj, (value, index) => {
      const keys = iteratee.call(context, value, index, obj);
      _.each(keys, (key) => {
        behavior(result, value, key);
      });
    });
    return result;
  }
} // groupEach()

export const groupByEach = groupEach((result, value, key) => {
  if (_.has(result, key)) {
    result[key].push(value);
  } else {
    result[key] = [value];
  }
}); // groupByEach()

export function userVerified() {
  const user = Meteor.user();
  return user && user.emails[0].verified;
} // userVerified()

// reverse order to make it easier to call
export function timeout(seconds, callback) {
  Meteor.setTimeout(callback, seconds);
}

// TODO doesn't work right with regex sep
export function rsplit(str, sep, maxsplit) {
  const split = str.split(sep);
  if (maxsplit) {
    return [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit))
  } else {
    return split
  }
} // rsplit()

// creates a function that invokes `func` on each sub in a tagged backtick
// string literal
export function tag(func) {
  return (pieces, ...subs) => {
    let result = pieces[0];
    for (let i = 0; i < subs.length; i++) {
      result += func(subs[i]) + pieces[i + 1];
    }
    return result;
  }
}

export const JSONTag = tag(JSON.stringify);
export const j = JSONTag;

