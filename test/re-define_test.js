var redefine = require('../lib')
  , _ = require('lodash')
  , fs = require('fs')
  , through = require('through2')
  , File = require('vinyl')
  , mock = require('mock-fs')

exports['integration'] = {
  'simple-require': function(test) {
    var file = new File({path: 'simple.js'})
    file.contents = new Buffer('require([],function() { return "test" })')

    convert( file
           , function(result) {
              test.equal('__e__="test"', result)
              test.done()
          })
  },
  'simple-define': function(test) {
    var file = new File({path: 'simple.js'})
    file.contents = new Buffer('define([],function() { return "test" })')

    convert( file
           , function(result) {
              test.equal('__e__="test"', result)
              test.done()
          })
  },
  'simple-cjs': function(test) {
    var file = new File({path: 'simple.js'})
    file.contents = new Buffer('module.exports = "test"')

    convert( file
           , function(result) {
              test.equal('__e__="test"', result)
              test.done()
          })
  },
  'load-dependency': function(test) {
    var file = new File({path: 'simple.js'})
    file.contents = new Buffer('module.exports = require("a");require("b");require("c");')

    convert( file
           , function(result) {
              test.equal('(function(){return"a"}())'
                         + '__e__="b"'
                         + '__e__="c"'
                         + '__e__=require("a")require("b")require("c")', result)

              mock.restore()
              test.done() 
            }
           , function() {
              mock({
                'a.js': '(function() { return "a" })()'
              , 'b.js': 'define(function() { return "b" })'
              , 'c.js': 'define([], function() { return "c" })'
            })
           })
  }
};

function convert(file, done, start) { 
  var config = redefine.config()
    , result

  config.wrapper = 'empty'
  config.exportVar = '__e__'

  var spy = function(config) {
      return through.obj(function(m,e,n) {
        this.push(m)
        n()
      })
  }

  var bundle = redefine.bundle(config, [spy])

  bundle.pipe(through(function(result, enc, cb) {
    done(escape(result.toString()))
  }))

  !!start && start()
  bundle.write(file)
}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}

