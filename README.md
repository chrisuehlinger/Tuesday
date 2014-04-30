# Tuesday.js

A JS framework for evaluating JS practice exercises. Now LIVE at http://chrisuehlinger.com/Tuesday

## Installing

Clone the repository. The fully built JS file should be there, but if it isn't then use `npm install` to install the dependencies and `grunt --force` (JSHint wasn't behaving) to build.

## API Documentation

The API is contained in `src/tuesday.js`, which can be loaded as a CommonJS module. It is defined as follows:

```javascript
var tuesday = require('tuesday');

//Create a new testing engine
var myTuesday = new tuesday.Tuesday();

//Set the white and black lists
myTuesday.setWhiteList([array of parse tree node types]);
myTuesday.setBlackList([array of parse tree node types]);

//Set a suggested structure
myTuesday.setStructure({OuterThing:{InnerThing:{InnerInnerThing:{}}, OtherInnerThing:{}}});

//Set some code to evaluate
myTuesday.setCode("A string of javascript code");

//Then run the checker and send the results to a callback
myTuesday.checkWork(callback);

//The callback will receive two arguments:
// 1. a boolean specifying whether the code is valid and
// 2. an array of messages

```

The file `test/tuesday_test.js` contains unit tests written for nodeunit. There are about 20 assertions in there right now, and on my machine they all pass successfully.

## The front end

The file main.jsx.js contains the code for the UI. It is built using Facebook's React framework, which is why there is some JSX (a sort of templating language) mixed in with the code. If you fire up the page, it will display 3 forms where you can set testing constraints, and a CodeMirror instance with some sample code. Editing either the constraints or the code will cause Tuesday to run and the results (the messages returned by Tuesday) will be displayed live.

## Choice of parser

I chose Esprima over Acorn. I looked up benchmarks for both, and didn't find that either had a significant performance advantage. Acorn claimed to be half the size of Esprima, which was a plus. However, Esprima won out based on overall API quality and documentation. Acorn's documentation was an annotated copy of its source. Esprima's documentation included articles on a number of possible use cases, sample code and demo projects. Esprima also struck me as a more professional option, whereas Acorn seemed a bit more like a hobby project that had gotten popular.

I'll admit that I was also a bit biased: I've seen Esprima used before, and I was aware of the ecosystem of tools that work well with it (such as estraverse, escodegen and esmorph) which make it easier to use the ASTs that it spits out. This was also a factor in my decision.

## Things I didn't get to...

Although I feel good about this project in its current state, there are a couple things that I didn't get to, that I would've done if I were working on this project long term.

I didn't have a Microsoft computer on hand (I'm currently away from home) and thus I couldn't test my page on anything prior to IE11 (my friend's work laptop was on hand). Ideally, I'd set up something like PhantomJS or Testling to do headless browser testing for browsers I don't have frequent access to.

I didn't experience any problems with blocking when I was running the code. However, if blocking were to become a problem, I would probably solve it by detecting whether the browser supports web workers, and then use one to run the parsing and traversing of the AST.
