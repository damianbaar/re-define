'use strict';

var redefine = require('../lib')
  , _ = require('underscore')
  , through = require('through2')

var req_mod_1 = {
    in: 'require([], function() { console.log("req") })'
  , out: '(function () {console.log("req");}())'
  }
  , req_mod_2 = {
    in: 'require(["a","b","c"], function(a,b,c) { console.log(a, b, c) })'
  , out: '(function (a, b, c) {console.log(a, b, c);}(a, b, c))'
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

function convert(input, done) { 
  var write = through()
    , config = redefine.config()
    , result

  config.wrapper = 'empty'
  config.separator = '|'

  write
    .pipe(redefine.convert(config))
    .pipe(through(function(chunk, enc, cb) { 
      this.push(chunk)
    }))
    .on('data', function(data) {
      done(escape(data.toString()))
    })

  write.push(input)
}

function values(args, out) {
  var prop = out ? 'out' : 'in'
    , separator = out ? '' : '|'

  var s = _(args)
            .map(function(e){ return e[prop] })
            .join(separator)

  return out ? escape(s) : s
}

function escape(val) {
  return val.replace(/\r?\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}

exports['main'] = {
  setUp: function(done) {
    done();
  },
  'convert-define-to-var': function(test) {
    convert(values([def_mod_1]), function(result) {
      test.equal(values([def_mod_1], true), result)
      test.done()
    })
  },
  'convert-multiple-define-to-var': function(test) {
    convert(
      values([def_mod_1, def_mod_2])
      , function(result) {
          var exp = values([def_mod_1, def_mod_2], true)

          test.equal(exp, result)
          test.done()
      })
  },
  'modules-order': function(test) {
    convert(
      values([def_mod_3, def_mod_2, def_mod_1])
      , function(result) {
          var exp = values([def_mod_1, def_mod_2, def_mod_3], true)

          test.equal(exp, result)
          test.done()
      })
  },
  'convert-single-require': function(test) {
    convert(values([req_mod_1]), function(result) {
      test.equal(values([req_mod_1], true), result)
      test.done()
    })
  },
  'convert-complex-require': function(test) {
    convert(
      values([def_mod_1, def_mod_2, def_mod_3, req_mod_2])
      , function(result) {
          var exp = values([def_mod_1, def_mod_2, def_mod_3, req_mod_2], true)

          test.equal(exp, result)
          test.done()
      })
  }
};
