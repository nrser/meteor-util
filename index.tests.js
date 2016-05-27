import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from './testing.js';
import * as Util from '.';

import './errors.tests.js';
import './Logger.tests.js';
import './check.tests.js';
import './object.tests.js';

import {j} from './index.js';

const log = Util.logger('imports:util:index:tests');

describe('index.js', () => {
  
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
