import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from 'meteor/nrser:util/testing.js';
import * as util from 'meteor/nrser:util';

import { Logger } from './Logger.js';

const log = util.logger('Logger:tests');

describe('Logger.js', () => {
  
  describe('Logger.snapshot()', () => {
    
    it("handles circular references", () => {
      const obj = {};
      obj.obj = obj;
      
      chai.expect(
        Logger.snapshot(obj)
      ).to.eql({obj: obj});
    });
    
  }); // describe example()
  
}); // describe logger.js