'use strict';

var tuesday = require('./tuesday');
//var CodeMirror = require('code-mirror');
var CodeMirror = require('code-mirror/mode/javascript');
var $ = require('jquery');

var editor = {};
var myTuesday = new tuesday.Tuesday();
myTuesday.setWhiteList(['WhileStatement']);
//myTuesday.setStructure({'ForStatement':{'IfStatement':{}}});
myTuesday.setStructure({'ForStatement':{'TryStatement':{'ThrowStatement':{}},'IfStatement':{}}});

$(document).ready(function() {
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
    '}'].join('\n');

  editor = CodeMirror.fromTextArea($('#editor')[0], {
    mode: "javascript",
    theme: "monokai",
    lineNumbers: true,
    autofocus: true
  });
  editor.setValue(sampleCode);

  editor.on("change", function(){
    myTuesday.setCode(editor.getValue());
    myTuesday.checkWork(function(valid,messages){
      var messageSpace = $('#messageSpace').empty();
      for(var i=0; i<messages.length; i++){
        console.log(messages[i]);
        if(valid)
          messageSpace.append('<div class="correct message">' + messages[i] + '</div>');
        else
          messageSpace.append('<div class="incorrect message">' + messages[i] + '</div>');
      }
    });
  });
});
