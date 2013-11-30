//      SauceJs - An AngularJS module for normalizing functions and sending them 
//      to a server for processing
//
//      Ver:	 	0.1
//      License: 	MIT
//      @require	https://raw.github.com/kriskowal/q/v0.9/q.js
"use strict";

var SauceJs;
var SauceJs1;
var Pot = {};
var Res = {};
var Wait = {};
var angular = window.angular;

// Define the `sauce` module under which all SauceJs services will live.
// angular.module("sauce", []).value("Sauce", Sauce);

if(angular){
angular.module("sauce", []).factory("sauceJs", ["$q", "$parse", "$timeout", "$http",
  function($q, $parse, $timeout, $http) {
    // The factory returns a new instance of the `Sauce` object, defined
    // below, everytime it is called. The factory takes 3 arguments:
    //
    //   * `ref`:    A SauceJs reference.
    //   * `$scope`: The scope with which the bound model is associated.

    return function(ref, scope, args) {
      var sjs = new SauceJs($q, $parse, $timeout, $http, ref);
      return sjs._(scope, args);
    };
  }
]);

// The `Sauce` object that implements implicit synchronization.
SauceJs = function($q, $parse, $timeout, $http, ref) {
  this._http = $http;
  this._q = $q;
  this._parse = $parse;
  this._timeout = $timeout;
  this._initial = true;
  this._remoteValue = false;
  this._hRef = ref;
  this._pot = {};
  this._res = {};
};

SauceJs.prototype = {

  _: function($scope, args) {
    var self = this;
    var processResp = function($scope, res){
      Res[JSON.stringify(args)] = res;
      Wait[JSON.stringify(args)] = false;
      var ret;
      if(res.scope){
        for(var k in res.scope){
          var local = angular.fromJson(angular.toJson(self._parse(k)($scope)));
          self._parse(k).assign($scope, angular.copy(res.scope[k]));
          $scope[k] = res.scope[k];
        }
      } 
      if(res.exec) {
        eval(res.exec)
      }
      if(res.val) {
        ret = res.val;
      }
      return ret;
    }

    var args2 = args;
    if(self._stir(args[0], args2.slice(1) ) && !Wait[JSON.stringify(args)] ) {
      processResp($scope, Res[JSON.stringify(args)]);
      return;
    }

    var deferred = this._q.defer();
    Wait[JSON.stringify(args)] = true;
    var run = this._http.post(this._hRef, args);
    run.success(function(resp){
      deferred.resolve(processResp($scope, resp));
    });

    //Res[JSON.stringify(args)] = 3

    return deferred.promise;
  },

  // Helper function to log messages.
  _log: function(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  },
  _stir : function(f, sO){
        var self = this;
        var tempF = JSON.stringify(f);
        var tempsO = JSON.stringify(sO);
	if(Pot[tempF] !== tempsO){
	    Pot[tempF] = tempsO;
	    return false;
        };
        return true;
    }
};
};


// The `Sauce` object that implements implicit synchronization.
SauceJs1 = function(ref) {
  this._q = Q;
  this._initial = true;
  this._remoteValue = false;
  this._hRef = ref;
  this._pot = {};
  this._res = {};
};

SauceJs1.prototype = {

  _: function(args) {
    var self = this;
    var processResp = function(res){
      Res[JSON.stringify(args)] = res;
      Wait[JSON.stringify(args)] = false;
      var ret;
      console.log(res);
      if(res.local){
        for(var k in res.local){
          window[k] = res.local[k];
        }
      } 
      if(res.exec) {
        eval(res.exec)
      }
      if(res.val) {
        ret = res.val;
      }
      console.log(ret)
      return ret;
    }

    var args2 = args;
    console.log(args2)
    if(self._stir(args[0], args2.slice(1) ) && !Wait[JSON.stringify(args)] ) {
        processResp(Res[JSON.stringify(args)]);
        return;
    }

    var deferred = this._q.defer();
    var xmlhttp = new XMLHttpRequest();
    Wait[JSON.stringify(args)] = true;

    xmlhttp.onreadystatechange=function()
    {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        deferred.resolve(processResp(JSON.parse(xmlhttp.responseText)));
      }
    }
    xmlhttp.open("POST",this._hRef,true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send(JSON.stringify(args));

    return deferred.promise;
  },

  // Helper function to log messages.
  _log: function(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  },
  _stir : function(f, sO){
        var self = this;
        var tempF = JSON.stringify(f);
        var tempsO = JSON.stringify(sO);
	if(Pot[tempF] !== tempsO){
	    Pot[tempF] = tempsO;
	    return false;
        };
        return true;
    }
};
var $z_ = function(args) {
  var sjs = new SauceJs1('/sauce');
    return sjs._([args.callee.name].concat(args));
  }
