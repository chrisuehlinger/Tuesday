'use strict';

var tuesday = require('./tuesday');
//var CodeMirror = require('code-mirror');
var CodeMirror = require('code-mirror/mode/javascript');
var $ = require('jquery');

$(document).ready(function() {
  var sampleCode = [
    'for(var i=0; i<100; i++){',
    '  if(i%3 === 0 && i%5 === 0)',
    '    console.log("FizzBuzz");',
    '  else if(i%3 === 0){',
    '    console.log("Fizz");',
    '  else if(i%5 === 0){',
    '    console.log("Buzz");',
    '  else',
    '    console.log(i);',
    '}'].join('\n');

  var myTextarea = $('#editor')[0]
  var editor = CodeMirror.fromTextArea(myTextarea, {
    mode: "javascript",
    theme: "monokai",
    lineNumbers: true
  });

  editor.setValue(sampleCode);
});
