/**
  * @jsx React.DOM
  */

'use strict';

var tuesday = require('./tuesday');
var CodeMirror = require('code-mirror/mode/javascript');
var $ = require('jquery');

var TestForm = React.createClass({displayName: 'TestForm',
  getInitialState: function(){
    return {whiteList:'WhileStatement',
            blackList:'FunctionDeclaration',
            structure:JSON.stringify({ForStatement:{TryStatement:{ThrowStatement:{}},IfStatement:{}}})}
  },
  handleChange: function(){
    var whiteListText = this.refs.whiteList.getDOMNode().value.trim();
    if(whiteListText.length > 0)
      this.props.tuesday.setWhiteList(whiteListText.split(' '));
    else
      this.props.tuesday.setWhiteList([]);


    var blackListText = this.refs.blackList.getDOMNode().value.trim();
    if(blackListText.length > 0)
      this.props.tuesday.setBlackList(blackListText.split(' '));
    else
      this.props.tuesday.setBlackList([]);

    var structureText = this.refs.structure.getDOMNode().value.trim();
    if(structureText.length > 0)
      try{
        this.props.tuesday.setStructure($.parseJSON(structureText));
      }catch(error){
        this.props.tuesday.setStructure({});
      }
    else
      this.props.tuesday.setStructure({});

    this.props.tuesday.checkWork(this.props.handleSubmit);
  },
  render: function(){
    return (
      React.DOM.form( {className:"testForm"}, 
        React.DOM.label(null, "WhiteList:",
          React.DOM.input( {type:"text",
                 defaultValue:this.state.whiteList,
                 ref:"whiteList",
                 onChange:this.handleChange} )
        ),
        React.DOM.br(null ),
        React.DOM.label(null, "BlackList:",
          React.DOM.input( {type:"text",
                 defaultValue:this.state.blackList,
                 ref:"blackList",
                 onChange:this.handleChange} )
        ),
        React.DOM.br(null ),
        React.DOM.label(null, "Suggested Structure:",
          React.DOM.input( {type:"text",
                 defaultValue:this.state.structure,
                 ref:"structure",
                 onChange:this.handleChange} )
        )
      )
    );
  }
});

var MessageBox = React.createClass({displayName: 'MessageBox',
  getInitialState:function(){
    return {valid:   true,
            messages: ['Type Something!']};
  },
  render: function(){
    var messageNodes = this.props.messages.map(function(message){
      return Message( {valid:this.props.valid, message:message} );
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

var App = React.createClass({displayName: 'App',
  getInitialState: function(){
    var myTuesday = new tuesday.Tuesday();
    myTuesday.setWhiteList(['WhileStatement']);
    myTuesday.setStructure({ForStatement:{TryStatement:{ThrowStatement:{}},IfStatement:{}}});

    return {tuesday: myTuesday,
            editor: {},
            code:['for(var i=0; i<100; i++){',
                  '  if(i%3 === 0 && i%5 === 0)',
                  '    console.log("FizzBuzz");',
                  '  else if(i%3 === 0)',
                  '    console.log("Fizz");',
                  '  else if(i%5 === 0)',
                  '    console.log("Buzz");',
                  '  else',
                  '    console.log(i);',
                  '}'].join('\n'),
            valid: true,
            messages: ['Type Something!']};
  },
  handleSubmit: function(){


    this.state.tuesday.checkWork(this.updateMessages)
  },
  updateMessages:function(){
    this.state.tuesday.checkWork(function(valid, messages){
      this.setState({valid: valid,
                     messages: messages});
    }.bind(this));
  },
  render: function(){
    return (
      React.DOM.div( {className:"app"}, 
      TestForm( {tuesday:this.state.tuesday,
                handleSubmit:this.handleSubmit}),
        React.DOM.textarea( {id:"editor"}),
      MessageBox( {valid:this.state.valid, messages:this.state.messages})
      )
    );
  },
  componentDidMount: function(){
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

  this.state.editor = CodeMirror.fromTextArea($('#editor')[0], {
    mode: "javascript",
    theme: "monokai",
    lineNumbers: true,
    autofocus: true
  });
  this.state.editor.setValue(this.state.code);
  this.state.tuesday.setCode(this.state.code);

  this.state.editor.on("change", function(){
    this.state.tuesday.setCode(this.state.editor.getValue());
    this.state.tuesday.checkWork(this.updateMessages)
  }.bind(this));

  }
});


$(document).ready(function() {
  React.renderComponent( App(null ), document.getElementById('app'));
});
