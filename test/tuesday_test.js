'use strict';

var tuesday = require('../src/tuesday');

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
    test.deepEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['constructor'] = {
  'check it exists': function(test) {
    var testTuesday = new tuesday.Tuesday();

    test.deepEqual(testTuesday.amIReal, 'yes', 'did not construct');
    test.deepEqual(testTuesday.whiteList, [], 'did not construct');
    test.deepEqual(testTuesday.blackList, [], 'did not construct');
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
  },
  'code passes whitelist': function(test){
    test.expect(2);

    this.testTuesday.setWhiteList(['VariableDeclaration', 'IfStatement']);
    this.testTuesday.setCode('var hello = "world";\n  if(hello === "world") console.log("Yay!");');
    this.testTuesday.checkWork(function(valid, messages){
      test.deepEqual(valid, true, 'shouldn\'t fail the test');
      test.deepEqual(messages, ['Your code looks good!'], 'wrong message');
      test.done();
    });
  },
  'code fails whitelist': function(test){
    test.expect(2);

    this.testTuesday.setWhiteList(['VariableDeclaration', 'IfStatement']);
    this.testTuesday.setCode('var hello = "world";');
    this.testTuesday.checkWork(function(valid, messages){
      test.deepEqual(valid, false, 'shouldn\'t pass the test');
      test.deepEqual(messages, ['Your code is missing a(n) IfStatement'], 'wrong message');
      test.done();
    });
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
  },
  'code passes blacklist': function(test){
    test.expect(2);

    this.testTuesday.setBlackList(['SwitchStatement', 'ReturnStatement']);
    this.testTuesday.setCode('var hello = "world";\n  if(hello === "world") console.log("Yay!");');
    this.testTuesday.checkWork(function(valid, messages){
      test.deepEqual(valid, true, 'shouldn\'t fail the test');
      test.deepEqual(messages, ['Your code looks good!'], 'wrong message');
      test.done();
    });
  },
  'code fails blacklist': function(test){
    test.expect(2);

    this.testTuesday.setBlackList(['VariableDeclaration', 'IfStatement']);
    this.testTuesday.setCode('var hello = "world";');
    this.testTuesday.checkWork(function(valid, messages){
      test.deepEqual(valid, false, 'shouldn\'t pass the test');
      test.deepEqual(messages, ['Your code should not contain a(n) VariableDeclaration'], 'wrong message');
      test.done();
    });
  }
};

exports['structure'] = {
  setUp: function(done) {
    this.testTuesday = new tuesday.Tuesday();
    done();
  },
  'init structure': function(test){
    this.testTuesday.setStructure({'thingWiththings':{'thingInThings':{}}});
    test.deepEqual(this.testTuesday.structure,
                   [ { type: 'thingWiththings',
                       valid: false, 'numTraversing':0,
                       substructure:[ { type: 'thingInThings',
                                        valid: false, 'numTraversing':0,
                                        substructure: [] }
                                    ]
                   } ],
                   'Did not set structure');
    test.done();
  },
  'produce readable structure': function(test){
    this.testTuesday.setStructure({'thingWiththings':{'thingInThings':{}}});
    test.deepEqual(this.testTuesday.getStructure(), {'thingWiththings':{'thingInThings':{}}}, 'did not return correct structure');
    test.done();
  },
  'code passes structure': function(test){
    test.expect(2);

    this.testTuesday.setStructure({'ForStatement':{'IfStatement':{}}});

        var sampleCode = [
    'for(var i=0; i<100; i++){',
    '  if(i%3 === 0 && i%5 === 0)',
    '    console.log("FizzBuzz");',
    '  else if(i%3 === 0)',
    '    console.log("Fizz");',
    '  else if(i%5 === 0)',
    '    console.log("Buzz");',
    '  else',
    '    console.log(i);',
    '}',
    '',
    'while(1){}'].join('\n');

    this.testTuesday.setCode(sampleCode);
    //this.testTuesday.setCode('for(var i=0; i<100; i++)\n  if(i%3 === 0) console.log("Fizz");');
    this.testTuesday.checkWork(function(valid, messages){
      test.deepEqual(valid, true, 'shouldn\'t fail the test');
      test.deepEqual(messages, ['Your code looks good!'], 'wrong message');
      test.done();
    });
  },
  'code fails structure': function(test){
    test.expect(2);

    this.testTuesday.setStructure({'ForStatement':{'IfStatement':{}}});



    this.testTuesday.setCode('for(var i=0; i<100; i++)\n  console.log("Oops!");\n  if(1<2)\n  1+1;');
    this.testTuesday.checkWork(function(valid, messages){
      test.deepEqual(valid, false, 'shouldn\'t pass the test');
      test.deepEqual(messages, ['Your code should have a(n) IfStatement inside of a(n) ForStatement'], 'wrong message');
      test.done();
    });
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

    this.testTuesday.checkWork(function(valid, messages){
      test.ok(valid);
      test.done();
    });
  }
};
