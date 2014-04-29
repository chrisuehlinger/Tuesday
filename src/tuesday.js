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

  exports.awesome = function() {
    return 'awesome';
  };

  exports.Tuesday = function() {
    this.amIReal = 'yes';

    this.setWhiteList = function(whiteList){
      this.whiteList = whiteList;
    };

    this.setBlackList = function(blackList){
      this.blackList = blackList;
    };

    this.setStructure = function(structure){
      this.structure = structure;
    };

    this.setCode = function(code){
      this.code = code;
    };

    this.checkWork = function(finished){
      finished(esprima.parse(this.code));
    };

    return this;
  };

}(typeof exports === 'object' && exports || this));
