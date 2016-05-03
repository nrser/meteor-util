export class SyntheticError {
  constructor(message, values = {}) {
    this.message = message;
    this.values = values;
    this.nativeError = new Error(
      `(${this.constructor.name}) ${ this. message }\n
      values: ${ JSON.stringify(this.values) }`
    );
    this.stack = this.nativeError.stack;
  }
}