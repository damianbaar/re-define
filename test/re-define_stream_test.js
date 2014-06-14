'use strict';

var redefine = require('../lib')
  , _ = require('lodash')
  , through = require('through2')

var req_mod_1 = {
    in: 'require([], function() { console.log("req") })'
  , out: 'var main = (function () {console.log("req");}())'
  }
  , req_mod_2 = {
    in: 'require(["a","b","c"], function(a,b,c) { console.log(a, b, c) })'
  , out: 'var main = (function (a, b, c) {console.log(a, b, c);}(a, b, c))'
  }
  , def_mod_1 = {
    in: 'define("a", [], function() { return "Hello" })'
  , out: 'var a = "Hello";'
  }
  , def_mod_2 = {
    in: 'define("b", ["a"], function(a) { var c = wrap(a) })'
  , out: 'var b = function (a) {var c = wrap(a);}(a)'
  }
  , def_mod_3 = {
    in: 'define("c", ["a","b"], function(a, b) { return "Hello" })'
  , out: 'var c = function (a, b) {return "Hello";}(a, b)'
 }

exports['main'] = {
  setUp: function(done) {
    done();
  },
  'convert-define-to-var': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(def_mod_1.out))
      test.done()
    })

    write.write(def_mod_1.in)
    write.end()
  },
  'convert-multiple-define-to-var': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(def_mod_1.out + def_mod_2.out))
      test.done()
    })

    write.write(def_mod_1.in)
    write.write(def_mod_2.in)
    write.end()
  },
  'modules-order': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(def_mod_1.out + def_mod_2.out + def_mod_3.out))
      test.done()
    })

    write.write(def_mod_3.in)
    write.write(def_mod_2.in)
    write.write(def_mod_1.in)
    write.end()
  },
  'convert-single-require': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(req_mod_1.out))
      test.done()
    })

    write.write(req_mod_1.in)
    write.end()
  },
  'convert-complex-require': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(def_mod_1.out + def_mod_2.out + def_mod_3.out + req_mod_2.out))
      test.done()
    })

    write.write(req_mod_2.in)
    write.write(def_mod_3.in)
    write.write(def_mod_2.in)
    write.write(def_mod_1.in)
    write.end()
  }
};

function convert(done) { 
  var write = through()
    , config = redefine.config()
    , result

  config.wrapper = 'empty'
  config.separator = '|'

  write.setEncoding('utf-8')

  write
    .pipe(redefine.fromContent(config))
    .on('data', function(data) {
      result = data
    })
    .on('end', function() {
      done(escape(result))
    })

  return write
}

function escape(val) {
  return val.replace(/\r?\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
            .replace(/\_[0-9]*/g, '')
}

