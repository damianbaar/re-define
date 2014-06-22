'use strict';

var redefine = require('../lib')
  , _ = require('lodash')
  , through = require('through2')

var req_mod_1 = {
    in: 'require([], function() { console.log("req") })'
  , out: 'var r_0 = (function () {console.log("req");}())'
  }
  , req_mod_2 = {
    in: 'require(["a","b","c"], function(a,b,c) { console.log(a, b, c) })'
  , out: 'var r_0 = (function (a, b, c) {console.log(a, b, c);}(a, b, c))'
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
  , cjs_mod_1 = {
    in: 'var test = require("a"); module.exports = test'
  , out: 'var cjs_0 = (function(r_0) { var test = r_0; return test })(a)'
  }
  , cjs_mod_2 = {
    in: 'var test = require("a");'
  , out: '(function(r_0) { var test = r_0 })(a)'
  }
  , amd_cjs_mod_1 = {
    in: 'define(function(require, exports, module) { module.exports = { test: "test" } })' 
  , out: 'var cjs_0 = return { test: \'test\' };;'
  }

exports['integration-file'] = {
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
  'convert-single-require': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(req_mod_1.out))
      test.done()
    })

    write.write(req_mod_1.in)
    write.end()
  },
  'convert-cjs-exports': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(cjs_mod_1.out))
      test.done()
    })

    write.write(cjs_mod_1.in)
    write.end()
  },
  'convert-amd-cjs': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(amd_cjs_mod_1.out))
      test.done()
    })

    write.write(amd_cjs_mod_1.in)
    write.end()
  },
  'convert-cjs-no-exports': function(test) {
    var write = convert(function(r) {
      test.equal(r, escape(cjs_mod_2.out))
      test.done()
    })

    write.write(cjs_mod_2.in)
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

