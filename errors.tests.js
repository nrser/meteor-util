import {chai} from 'meteor/practicalmeteor:chai';
import {itMaps} from './testing.js';
import * as Util from '.';

import {UtilError, SyntheticError} from './errors';

const log = Util.logger('imports:util:errors:tests');

describe('imports/util/errors', () => {
  
  describe('new SyntheticError()', () => {
    let error;
    
    try {
      throw new SyntheticError("i'm a Synthetic Error!", {x: 'ex'});
    } catch(e) {
      error = e;
    } 
    
    it("is NOT an instance of Error", () => {
      chai.expect(error).not.to.be.instanceof(Error);
    });
    
    it("is an instance of SyntheticError", () => {
      chai.expect(error).to.be.instanceof(SyntheticError);
    });
    
    it("has correct values property", () => {
      chai.expect(error.values).to.be.instanceof(Object);
      chai.expect(error.values.x).to.equal('ex');
    });
    
  }); // describe new SyntheticError()
  
  describe('new UtilError()', () => {
    const error = new UtilError("i'm a UtilError!", {x: 'ex'});
    
    it("is an instance of Error", () => {
      chai.expect(error).not.to.be.instanceof(Error);
    });
    
    it("is an instance of SyntheticError", () => {
      chai.expect(error).to.be.instanceof(SyntheticError);
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