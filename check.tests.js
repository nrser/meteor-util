import { _ } from 'meteor/underscore';
import { chai } from 'meteor/practicalmeteor:chai';
import { itMaps } from 'meteor/nrser:util/testing.js';
import * as Util from 'meteor/nrser:util';

import {
  MatchError,
  match,
  Match,
} from './check.js';

const log = Util.logger('check:tests');

describe('match.js', () => {
  
  describe('match()', () => {
    
    class A {
      constructor(x) {
        this.x = x;
      }
    }
    
    class AA extends A {}
    
    class B {
      constructor(x) {
        this.x = x;
      }
    }
    
    it("throws an error when there is no match", () => {
      const value = "hey";
      let error;
      
      try {
        match("hey");
      } catch(e) {
        // throw e;
        error = e;
      }
      
      chai.expect(error).to.be.instanceOf(MatchError);
      chai.expect(error.values.value).to.equal(value);
      chai.expect(error.values.patterns).to.eql([]);
    });
    
    it("matches against instances",  () => {
      const a = new A();
      const b = new B();
      const patterns = [
        [A, a => 'A'],
        [B, b => 'B'],
      ];
      
      chai.expect(match(a, ...patterns)).to.equal('A');
      chai.expect(match(b, ...patterns)).to.equal('B');
      chai.expect(
        () => match('x', ...patterns)
      ).to.throw(MatchError);
    });
    
    it("matches against subclasse instances", () => {
      const aa = new AA('aye aye');
      chai.expect(
        match(aa,
          [AA, (v) => 'AA']
        )
      ).to.equal('AA');
    });
    
    it("matches against other stuff", () => {
      const patterns = [
        [String, v => "string!"],
        [Match.Where(v => v % 2 === 0), v => "even"],
        [Match.Where(v => v % 2 === 1), v => "odd"],
      ];
      
      chai.expect(match("blah", ...patterns)).to.equal("string!");
      chai.expect(match(1, ...patterns)).to.equal("odd");
      chai.expect(match(2, ...patterns)).to.equal("even");
    });
    
  }); // describe match()
  
}); // describe check.js