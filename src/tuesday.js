/*
 * Tuesday
 * https://github.com/chrisuehlinger/tuesday
 *
 * Copyright (c) 2014 Chris Uehlinger
 * Licensed under the MIT license.
 */

(function(exports) {

  'use strict';

  var esprima = require('esprima');
  var estraverse = require('estraverse');

  exports.awesome = function() {
    return 'awesome';
  };

  exports.Tuesday = function() {
    this.amIReal = 'yes';
    this.whiteList = [];
    this.blackList = [];
    this.structure = [];

    this.setWhiteList = function(whiteList){
      this.whiteList = whiteList;
    };

    this.setBlackList = function(blackList){
      this.blackList = blackList;
    };

    this.setStructure = function(structure){
      var buildStructure = function(tree){
        var newStruct = [];
        for (var type in tree){
          var newNode = {'type':type, 'valid':false, 'numTraversing':0};
          if(tree[type] !== {}){
            newNode['substructure'] = buildStructure(tree[type]);
          }
          newStruct.push(newNode);
        }
        return newStruct;
      };

      this.structure = buildStructure(structure);
    };

    this.setCode = function(code){
      this.code = code;
    };

    this.checkWork = function(callback){

      try {
        var messages = [];
        var valid = false;

        var whiteListCheck = [];
        for (var i = 0; i<this.whiteList.length; i++)
          whiteListCheck[i] = false;

        var checkStructureEnter = function(node, structure){
          for(var i=0; i<structure.length; i++)
            if(structure[i]['numTraversing'] > 0){
              checkStructureEnter(node, structure[i]['substructure']);
            }else if(structure[i]['type'] === node.type){
              structure[i]['valid'] = true;
              structure[i]['numTraversing']++;
            }
        }.bind(this);

        var checkStructureLeave = function(node, structure){
          for(var i=0; i<structure.length; i++)
            if(structure[i]['type'] === node.type)
              structure[i]['numTraversing']--;
            else if(structure[i]['numTraversing'] > 0)
              checkStructureLeave(node, structure[i]['substructure']);
        }.bind(this);

        var ast = esprima.parse(this.code);
        //console.log(JSON.stringify(ast));
        estraverse.traverse(ast, {
          enter: function(node){
            for(var i = 0; i<this.whiteList.length; i++)
              if(this.whiteList[i] === node.type)
                whiteListCheck[i] = true;

            for(var i = 0; i<this.blackList.length; i++)
              if(this.blackList[i] === node.type)
                messages.push('Your code should not contain a(n) ' + node.type);

            checkStructureEnter(node, this.structure);
          }.bind(this),
          leave: function(node){
            checkStructureLeave(node, this.structure);
          }.bind(this)
        });

        for (var i = 0; i<whiteListCheck.length; i++)
          if(!whiteListCheck[i])
            messages.push('Your code is missing a(n) ' + this.whiteList[i]);

        var structureMessages = function (structure){
          var myMessages = [];

          for(var i=0; i<structure.length; i++){
            var insideMessages = structureMessages(structure[i]['substructure']);
            for(var j=0; j<insideMessages.length; j++){
              myMessages.push(insideMessages[j] + ' inside of a(n) ' + structure[i]['type']);
            }

            if(structure[i]['valid'] === false)
              myMessages.push('Your code should have a(n) ' + structure[i]['type']);
          }

          return myMessages;
        };

        var newMessages = structureMessages(this.structure);
        for(var i=0; i<newMessages.length; i++)
          messages.push(newMessages[i]);

        if(messages.length === 0){
          messages.push('Your code looks good!');
          valid = true;
        }

        callback(valid, messages);
      }catch(error){
        callback(false, ['Syntax Error: ' + error.message]);
        //throw error;
       }

    };

    return this;
  };

}(typeof exports === 'object' && exports || this));


