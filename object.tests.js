import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from './testing.js';
import * as Util from '.';

const log = Util.logger('imports:util:object:tests');

describe('object.js', () => {
  
  describe("mergeNoConflicts", () => {
    it("succeeds when there are no conflicts", () => {
      chai.expect(
        Util.mergeNoConflicts({a: 1}, {b: 2}, {c: 3, d: 4})
      ).to.eql({a: 1, b: 2, c: 3, d: 4});
    });
    
    it("fails when there are conflicts", () => {
      chai.expect(() => {
        Util.mergeNoConflicts({a: 1}, {a: 2})
      }).to.throw(Util.MergeConflictError);
    });
  }); // mergeNoConflicts
  
}); // describe imports/util/index.js
