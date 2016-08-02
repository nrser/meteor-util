import { Meteor } from 'meteor/meteor';

export class MeteorError extends Meteor.Error {
  constructor(message, details = {}) {
    // don't pass anything since we need `this.constructor` to get the `error`
    // field
    super();
    
    // then set everything ourselves
    this.error = this.constructor.name;
    this.reason = message;
    this.message = `${ message } [${ this.error }]`;
    this.details = details;
  }
}

export class UtilError extends MeteorError {}
