import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from 'nrser/lib/testing';
import * as util from '.';

import { UtilError, MeteorError } from './errors.js';

const log = util.logger('imports:util:errors:tests');

describe('imports/util/errors', () => {
  
  describe('new MeteorError()', () => {
    let error;
    
    try {
      throw new MeteorError("i'm a Synthetic Error!", {x: 'ex'});
    } catch(e) {
      error = e;
    } 
    
    it("is an instance of Error", () => {
      chai.expect(error).to.be.instanceof(Error);
    });
    
    it("is an instance of Meteor.Error", () => {
      chai.expect(error).to.be.instanceof(Meteor.Error);
    });
    
    it("is an instance of MeteorError", () => {
      chai.expect(error).to.be.instanceof(MeteorError);
    });
    
    it("has correct details property", () => {
      chai.expect(error.details).to.be.instanceof(Object);
      chai.expect(error.details.x).to.equal('ex');
    });
    
  }); // describe new MeteorError()
  
  describe('new UtilError()', () => {
    const error = new UtilError("i'm a UtilError!", {x: 'ex'});
    
    it("is an instance of Error", () => {
      chai.expect(error).to.be.instanceof(Error);
    });
    
    it("is an instance of MeteorError", () => {
      chai.expect(error).to.be.instanceof(MeteorError);
    });
    
    it("is an instance of UtilError", () => {
      chai.expect(error).to.be.instanceof(UtilError);
    });
    
    it("has correct details property", () => {
      chai.expect(error.details).to.be.instanceof(Object);
      chai.expect(error.details.x).to.equal('ex');
    });
    
  }); // describe new ExtendableError()
  
}); // describe imports/util/errors.js