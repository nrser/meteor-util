import { Meteor } from 'meteor/meteor';

export class BaseError extends Meteor.Error {
  constructor(message, values = {}) {
    super(message);
    this.values = values;
    // this.nativeError = new Error(
    //   `(${this.constructor.name}) ${ this. message }\n
    //   values: ${ JSON.stringify(this.values) }`
    // );
    // this.stack = this.nativeError.stack;
  }
}