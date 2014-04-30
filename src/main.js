/**
  * @jsx React.DOM
  */

'use strict';

var tuesday = require('./tuesday');
var CodeMirror = require('code-mirror/mode/javascript');
var $ = require('jquery');

var editor = {};
var myTuesday = new tuesday.Tuesday();
myTuesday.setWhiteList(['WhileStatement']);
myTuesday.setStructure({'ForStatement':{'TryStatement':{'ThrowStatement':{}},'IfStatement':{}}});

var MessageBox = React.createClass({displayName: 'MessageBox',
  getInitialState:function(){
    return {valid:   true,
            messages: ['Type Something!']};
  },
  updateMessages:function(){
    console.log("Whoopy");
    myTuesday.checkWork(function(valid, messages){
      this.setState({valid: valid,
                     messages: messages});
    }.bind(this));
  },
  componentWillMount:function(){
    this.updateMessages();
    setInterval(this.updateMessages, this.props.pollInterval);
  },
  render: function(){
    var messageNodes = this.state.messages.map(function(message){
      return Message( {valid:this.state.valid, message:message} );
    }.bind(this));

    return (
      React.DOM.div( {className:"messageBox"}, 
        messageNodes
      )
    );
  }
});

var Message = React.createClass({displayName: 'Message',
  render: function(){
    return (
      React.DOM.div( {className:"message", 'data-valid':this.props.valid}, this.props.message)
    );
  }
});

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
  });

  React.renderComponent(
                             MessageBox( {pollInterval:1000}),
                             document.getElementById('MessageBox'));
});
