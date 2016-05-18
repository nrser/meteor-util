import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from '../testing.js';
import * as Util from '..';

import {UtilError, BaseError} from '.';

const log = Util.logger('imports:util:errors:tests');

describe('imports/util/errors', () => {
  
  describe('new BaseError()', () => {
    let error;
    
    try {
      throw new BaseError("i'm a Synthetic Error!", {x: 'ex'});
    } catch(e) {
      error = e;
    } 
    
    it("is an instance of Error", () => {
      chai.expect(error).to.be.instanceof(Error);
    });
    
    it("is an instance of Meteor.Error", () => {
      chai.expect(error).to.be.instanceof(Meteor.Error);
    });
    
    it("is an instance of BaseError", () => {
      chai.expect(error).to.be.instanceof(BaseError);
    });
    
    it("has correct values property", () => {
      chai.expect(error.values).to.be.instanceof(Object);
      chai.expect(error.values.x).to.equal('ex');
    });
    
  }); // describe new BaseError()
  
  describe('new UtilError()', () => {
    const error = new UtilError("i'm a UtilError!", {x: 'ex'});
    
    it("is an instance of Error", () => {
      chai.expect(error).to.be.instanceof(Error);
    });
    
    it("is an instance of BaseError", () => {
      chai.expect(error).to.be.instanceof(BaseError);
    });
    
    it("is an instance of UtilError", () => {
      chai.expect(error).to.be.instanceof(UtilError);
    });
    
    it("has correct values property", () => {
      chai.expect(error.values).to.be.instanceof(Object);
      chai.expect(error.values.x).to.equal('ex');
    });
    
  }); // describe new ExtendableError()
  
}); // describe imports/util/errors.js