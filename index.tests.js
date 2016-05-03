import {chai} from 'meteor/practicalmeteor:chai';
import {itMaps} from '/imports/util/testing.js';
import * as Util from '/imports/util';

import {j} from './index.js';

const log = Util.logger('imports:util:index:tests');

describe('imports/util/index.js', () => {
  
  describe('j()', () => {
    
    it("works on literals", () => {
      const i = "I";
      const too = 2;
      
      chai.expect(
        j`here ${i} am`
      ).to.equal('here "I" am');
      
      chai.expect(
        j`here ${i} am ${too}`
      ).to.equal('here "I" am 2');
      
    });
    
  }); // describe j()
  
}); // describe imports/util/index.js