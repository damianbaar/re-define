'use strict';

var reason = require('../lib/index')
  , config = require('../lib/config')
  , _ = require('underscore')

var req_mod_1 = {
    in: 'require([], function() { console.log("req") })'
  , out: '(function () {console.log("req");}());'
  }
  , req_mod_2 = {
    in: 'require(["a","b","c"], function(a,b,c) { console.log(a, b, c) })'
  , out: '(function (a, b, c) {console.log(a, b, c);}(a, b, c));'
  }
  , def_mod_1 = {
    in: 'define("a", [], function() { return "Hello" })'
  , out: 'var a = "Hello";'
  }
  , def_mod_2 = {
    in: 'define("b", ["a"], function(a) { var c = wrap(a) })'
  , out: 'var b = function (a) {var c = wrap(a);}(a);'
  }
  , def_mod_3 = {
    in: 'define("c", ["a","b"], function(a, b) { return "Hello" })'
  , out: 'var c = function (a, b) {return "Hello";}(a, b);'
 }

var config = config({
        formatter: {
          format: {
            indent: {style: '', base: 0}
          , space: ' '
          , quotes: 'double'
          , newline: ''
        }
      }
    })

function convert(input, done) { reason.stream(config, input, done) }

function values(args, out) {
  var prop = out ? 'out' : 'in'
    , separator = out ? '' : ';'

  return _(args)
            .map(function(e){ return e[prop] })
            .join(separator)
}

exports['main'] = {
  setUp: function(done) {
    done();
  },
  'convert-define-to-var': function(test) {
    convert(values([def_mod_1]), function(result) {
      test.equal(values([def_mod_1], true), result.code)
      test.done()
    })
  },
  'convert-multiple-define-to-var': function(test) {
    convert(
      values([def_mod_1, def_mod_2])
      , function(result) {
          var exp = values([def_mod_1, def_mod_2], true)

          test.equal(exp, result.code)
          test.done()
      })
  },
  'modules-order': function(test) {
    convert(
      values([def_mod_3, def_mod_2, def_mod_1])
      , function(result) {
          var exp = values([def_mod_1, def_mod_2, def_mod_3], true)

          test.equal(exp, result.code)
          test.done()
      })
  },
  'convert-single-require': function(test) {
    convert(values([req_mod_1]), function(result) {
      test.equal(values([req_mod_1], true), result.code)
      test.done()
    })
  },
  'convert-complex-require': function(test) {
    convert(
      values([def_mod_1, def_mod_2, def_mod_3, req_mod_2])
      , function(result) {
          var exp = values([def_mod_1, def_mod_2, def_mod_3, req_mod_2], true)

          test.equal(exp, result.code)
          test.done()
      })
  }
};
