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

      //This function takes easy to read structures and
      //converts them to a format that is more useful
      //when traversing the parse tree
      var buildStructure = function(tree){
        var newStruct = [];
        for (var type in tree){
          var newNode = {'type':type,        // The type of the node
                         'valid':false,      // Whether an instance of this node has been found (within the parent nodes)
                         'numTraversing':0}; // How many times we've seen a node of this type at this depth in the parse tree

          if(tree[type] !== {}){
            newNode['substructure'] = buildStructure(tree[type]);
          }
          newStruct.push(newNode);
        }
        return newStruct;
      };

      this.structure = buildStructure(structure);
    };

    //This function converts the interior format back into an easy to read structure
    this.getStructure = function(){
      var helper = function(structure){
        var newStructure = {};
        for(var i=0; i<structure.length; i++)
          newStructure[structure[i]['type']] = helper(structure[i]['substructure']);
        return newStructure;
      };

      return helper(this.structure);
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

        //On the way down the parse tree, check if the node type has been seen before.
        //If it has, move down the suggested structure tree looking for matches.
        var checkStructureEnter = function(node, structure){
          for(var i=0; i<structure.length; i++)
            if(structure[i]['numTraversing'] > 0){
              checkStructureEnter(node, structure[i]['substructure']);
            }else if(structure[i]['type'] === node.type){
              structure[i]['valid'] = true;
              structure[i]['numTraversing']++;
            }
        }.bind(this);

        //On the way up the parse tree, decrement "numTraversing" for node types as we leave them.
        //This method also limits the amount of the suggested structure that gets traversed at each node.
        var checkStructureLeave = function(node, structure){
          for(var i=0; i<structure.length; i++)
            if(structure[i]['type'] === node.type)
              structure[i]['numTraversing']--;
            else if(structure[i]['numTraversing'] > 0)
              checkStructureLeave(node, structure[i]['substructure']);
        }.bind(this);

        var ast = esprima.parse(this.code);
        //console.log(JSON.stringify(ast));

        //Estraverse lets you set a callback for entering and leaving nodes
        //The "enter" callback is used for checking against the white and black list
        //Both callbacks are needed for checking the suggested structure.
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

        //After traversing the whole tree, any white list entries
        //that haven't been found must be missing
        for (var i = 0; i<whiteListCheck.length; i++)
          if(!whiteListCheck[i])
            messages.push('Your code is missing a(n) ' + this.whiteList[i]);

        //This recursive function produces messages describing
        //which parts of the suggested structure are missing
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

        //If there are no messages, then the code must be valid
        if(messages.length === 0){
          messages.push('Your code looks good!');
          valid = true;
        }

        callback(valid, messages);
      }catch(error){
        //If there is a syntax error in the code,
        //it'll throw a SyntaxError when esprima tries to parse it
        callback(false, ['Syntax Error: ' + error.message]);
       }

    };

    return this;
  };

}(typeof exports === 'object' && exports || this));


