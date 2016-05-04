import { _ } from 'meteor/underscore';
import { check as meteorCheck, Maybe } from 'meteor/check';
import { Match } from 'meteor/check'

import { setting } from './setting.js';

let clc;
if (Meteor.isServer) {
  clc = require('cli-color');
}

function check(value, pattern) {
  try {
    meteorCheck(value, pattern);
  } catch (error) {
    throw new Error(`value ${ JSON.stringify(value) } failed check: ${ error }`);
  }
}

// adapted from pince
// 
// https://github.com/mad-eye/pince
// 
// except it logs snapshots of objects so you can see what they looked like
// when the logging happen.
// 

// constants
// =========

const IDENTITY = function(x) { return x; };

const COLORS = Meteor.isServer ? {
  error: clc.red.bold,
  warn: clc.yellow,
  info: clc.bold,
  debug: clc.blue,
  trace: clc.blackBright,
} : {
  error: IDENTITY,
  warn: IDENTITY,
  info: IDENTITY,
  debug: IDENTITY,
  trace: IDENTITY,
};

function pad(d, n) {
  d = d.toString();
  while (d.length < n) {
    d = '0' + d;
  }
  return d;
} // pad()

const DATE_FORMAT_TOKENS = {
  'YYYY': (d) => { return pad(d.getFullYear(), 4) },
  'MM': (d) => { return pad(d.getMonth(), 2) },
  'DD': (d) => { return pad(d.getDate(), 2) },
  'HH': (d) => { return pad(d.getHours(), 2) },
  'mm': (d) => { return pad(d.getMinutes(), 2) },
  'ss': (d) => { return pad(d.getSeconds(), 2) },
  'SSS': (d) => { return pad(d.getMilliseconds(), 3) },
};

/**
* map of level names => level numbers
*/
const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const FORMAT_TOKENS = {
  '%T': (data) => { return data.formattedTimestamp },
  '%L': (data) => { return COLORS[data.level](data.level) },
  '%N': (data) => { return data.name },
  '%M': (data) => { return data.messages[0] },
};

const MATCH_LEVEL = Match.Where(function(level) {
  return _.has(LEVELS, level)
});

// module variables
// ================

let dateFormatStr = "YYYY-MM-DD HH:mm:ss.SSS";

// let formatStr = "%T %L:  [%N]  %M";
let formatStr = "%T %L:  [%N]";

const specificLogLevels = {};
let baseLogLevel = null;

const instanceCache = {};

export class Logger {
  // static methods
  // ==============
  
  static formatDate(date, formatStr = dateFormatStr) {
    let str = formatStr;
    _.each(DATE_FORMAT_TOKENS, (valueFn, token) => {
      const value = valueFn(date);
      str = str.replace(token, value);
    });
    return str;
  }
  
  static formatLog(data, formatStr = formatStr) {
    let str = formatStr;
    _.each(FORMAT_TOKENS, (valueFn, token) => {
      const value = valueFn(data);
      str = str.replace(token, value);
    });
    // output = data.messages.slice(1);
    output = data.messages;
    output.unshift(str);
    return output;
  } // formatLog()
  
  static findLevelFor(name) {
     // Check first for any specific levels
    const level = specificLogLevels[name];
    
    // return that if we have it
    if (level) {
      return level;
    }

    // Check hierarchically up the : chain
    let parentName = name;
    while (parentName.indexOf(':') > -1) {
      const lastIdx = parentName.lastIndexOf(':');
      parentName = parentName.substr(0, lastIdx);
      
      // return that if we found one
      if (_.has(specificLogLevels, parentName)) {
        return specificLogLevels[parentName];
      }
    }
    
    // return the base level
    return baseLogLevel;
  } // findLevelFor
  
  static shouldLog(name, level) {
    const allowedLevelNum = LEVELS[Logger.findLevelFor(name)];
    if (LEVELS[level] > allowedLevelNum) {
      return false;
    }
    return true;
  } // shouldLog()
  
  static canReferenceInSnaphot(value) {
    return (
      _.isBoolean(value) ||
      _.isNull(value) ||
      _.isUndefined(value) ||
      _.isNumber(value) ||
      _.isString(value) ||
      _.isFunction(value) ||
      _.isNaN(value)
    )
  } // canReferenceInSnaphot()
  
  static cloneRegExp(input) {
    var pattern = input.source;
    var flags = "";
    
    // Test for global.
    if (input.global) {
      flags += "g";
    }
    // Test for ignoreCase.
    if (input.ignoreCase) {
      flags += "i";
    }
    // Test for multiline.
    if (input.multiline) {
      flags += "m";
    }
    // Return a clone with the additive flags.
    return new RegExp(pattern, flags);
  } // cloneRegExp()
  
  static snapshot(value, seen = new Set()) {
    if (Logger.canReferenceInSnaphot(value)) {
      return value;
      
    } else if (_.isDate(value)) {
      return new Date(value);
      
    } else if (_.isArray(value)) {
      if (seen.has(value)) {
        return "CIRCULAR REFERENCE";
      } else {
        seen.add(value);
        return _.map(value, function(i){ return Logger.snapshot(i, seen) });
      }
      
    } else if (_.isRegExp(value)) {
      return cloneRegExp(value);
    
    // } else if (_.isError(value)) {
    //   // TODO prob not right but how often to we mutate errors?
    //   return value;
      
    } else if (_.isObject(value)) {
      if (seen.has(value)) {
        return "CIRCULAR REFERENCE";
      } else {
        seen.add(value);
        const copy = {};
        _.each(value, function(v, k) { copy[k] = Logger.snapshot(v, seen) });
        return copy;
      }
      
    } else {
      console.log("snapshot() is not sure what this is", value);
      
      return `UNKNOWN: ${ value }`;
    }
  } // snapshot()
  
  static setLevel({name, level}) {
    check(name, Match.Maybe(String));
    check(level, MATCH_LEVEL);
    
    if (name) {
      specificLogLevels[name] = level;
    } else {
      baseLogLevel = level;
    }
  } // setLevel()
  
  static setLevels(levels) {
    _.each(levels, (level, name) => {
      check(name, String);
      check(level, MATCH_LEVEL);
      specificLogLevels[name] = level;
    });
  } // setLevels();
  
  static setDateFormat(str) {
    dateFormatStr = str;
  } // setDateFormat()
  
  static setFormat(str) {
    formatStr = str;
  } // setFormat()
  
  static log(data) {
    if (!Logger.shouldLog(data.name, data.level)) {
      return;
    }
    
    this.output(data);
  } // log
  
  static output(data) {
    data.formattedTimestamp = Logger.formatDate(data.timestamp, dateFormatStr);
    
    // snapshot the messages
    //
    // we're sure we're going to log at this point, so do that work
    // 
    data.messages = Logger.snapshot(data.messages);
    
    const output = Logger.formatLog(data, formatStr)
    
    let fn;
    switch (data.level) {
      case 'trace':
      case 'debug':
        fn = console.log;
        break;
        
      case 'info': 
        fn = console.info || console.log;
        break;
      
      case 'warn':
        fn = console.warn || console.log;
        break;
        
      case 'error':
        fn = console.error || console.log;
        break;
    }
    
    fn.apply(console, output);
  } // output
  
  static getSpecificLogLevels() {
    return specificLogLevels;
  }
  
  // instance methods
  // ================
  
  constructor(name) {
    this.name = name;
  } // constructor
  
  trace(...messages) {
    this.log('trace', messages);
  } // trace
  
  debug(...messages) {
    this.log('debug', messages);
  } // debug
  
  info(...messages) {
    this.log('info', messages);
  } // info
  
  warn(...messages) {
    this.log('warn', messages);
  } // warn
  
  error(...messages) {
    this.log('error', messages);
  } // error
  
  log(level, messages) {
    if (!_.isArray(messages)) {
      messages = [messages];
    }
    
    const data = {
      level,
      messages,
      name: this.name,
      timestamp: new Date(),
    };
    
    Logger.log(data);
  }
  
} // class Logger

export function logger(name, {level} = {}) {
  if (level) {
    Logger.setLevel({name, level});
  }
  
  if (!_.has(instanceCache, name)) {
    const newLogger = new Logger(name);
    instanceCache[name] = newLogger;
  }
  
  return instanceCache[name];
} // logger()

if (setting('baseLogLevel', null)) {
  Logger.setLevel({level: setting('baseLogLevel', null)});
}

if (setting('specificLogLevels', null)) {
  Logger.setLevels(setting('specificLogLevels'));
}