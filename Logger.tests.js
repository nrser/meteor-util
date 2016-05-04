import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from 'meteor/nrser:util/testing.js';
import * as Util from 'meteor/nrser:util';

import { Logger } from './Logger.js';

const log = Util.logger('Logger:tests');

describe('Logger.js', () => {
  
  describe('Logger.snapshot()', () => {
    
    it("handles circular references", () => {
      const obj = {};
      obj.obj = obj;
      
      chai.expect(
        Logger.snapshot(obj)
      ).to.eql({obj: "CIRCULAR REFERENCE"});
    });
    
  }); // describe example()
  
}); // describe logger.js