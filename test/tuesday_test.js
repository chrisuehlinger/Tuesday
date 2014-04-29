'use strict';

var tuesday = require('../src/tuesday.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    test.equal(tuesday.awesome(), 'awesome', 'should be awesome.');
    test.done();
  }
};

exports['constructor'] = {
  'check it exists': function(test) {
    var testTuesday = new tuesday.Tuesday();
    test.deepEqual(testTuesday.amIReal, 'yes', 'did not construct');
    test.done();
  }
};

exports['whiteList'] = {
  setUp: function(done) {
    this.testTuesday = new tuesday.Tuesday();
    done();
  },
  'init whiteList': function(test){
    this.testTuesday.setWhiteList(['thing1', 'thing2']);
    test.deepEqual(this.testTuesday.whiteList, ['thing1', 'thing2'], 'Did not set whiteList');
    test.done();
  }
};

exports['blackList'] = {
  setUp: function(done) {
    this.testTuesday = new tuesday.Tuesday();
    done();
  },
  'init blackList': function(test){
    this.testTuesday.setBlackList(['thing1', 'thing2']);
    test.deepEqual(this.testTuesday.blackList, ['thing1', 'thing2'], 'Did not set blackList');
    test.done();
  }
};

exports['structure'] = {
  setUp: function(done) {
    this.testTuesday = new tuesday.Tuesday();
    done();
  },
  'init structure': function(test){
    this.testTuesday.setStructure({'thingWiththings':{'thingInThings':{}}});
    test.deepEqual(this.testTuesday.structure, {'thingWiththings':{'thingInThings':{}}}, 'Did not set structure');
    test.done();
  }
};

exports['code'] = {
  setUp: function(done) {
    this.testTuesday = new tuesday.Tuesday();
    done();
  },
  'init code': function(test){
    this.testTuesday.setCode('var hello = "world";');
    test.deepEqual(this.testTuesday.code, 'var hello = "world";', 'Did not set code');
    test.done();
  }
};

exports['checkWork'] = {
  setUp: function(done) {
    this.testTuesday = new tuesday.Tuesday();
    done();
  },
  'see if callback works': function(test){
    test.expect(1);
    this.testTuesday.setCode('var hello = "world";\nif(hello==="world") console.log("Yay!");');

    this.testTuesday.checkWork(function(result){
      test.ok(result);
      test.done();
    });
  }
};
