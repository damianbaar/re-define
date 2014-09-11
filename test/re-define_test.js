var redefine = require('../lib')
  , _ = require('lodash')
  , fs = require('fs')
  , through = require('through2')
  , File = require('vinyl')
  , mock = require('mock-fs')

var bundle
  , basedir = process.cwd()
  , spy

exports['integration'] = {
  setUp: function(cb) {
    process.chdir(__dirname)

    createBundle()

    mock({
      'a.js': '(function() { return "a" })()'
    , 'b.js': 'define(function() { return "b" })'
    , 'c.js': 'define([], function() { return "c" })'
    })
    cb()
  },
  tearDown: function(cb) {
    mock.restore()
    process.chdir(basedir)
    cb()
  },
  'load dependencies and set namespace for require calls': function(test) {
    var file = new File({path: 'simple.js'})
    file.contents = new Buffer('module.exports = {};require("a");require("b");require("c");')

    _.each([file], bundle.write)

    bundle.on('data', function(result) {
      result = escape(_.pluck([result], 'contents').join())

      test.equal('(function(){return"a"}())'
                 + 'return"b"'
                 + 'return"c"'
                 + 'module.exports={}require("test/a")require("test/b")require("test/c")', result)
    })
    .on('end', test.done)
  },
  'try to load duplicates': function(test) {
    var callCounts = 0
      , file

    spy.pipe(through.obj(function(f,e,n) {
      callCounts++
      this.push(f)
      n()
    }))

    file = new File({path: 'simple.js'})
    file.contents = new Buffer('module.exports = {};require("a");require("b");require("c");')

    _.each([ file
           , new File({path:'a.js'})
           , new File({path:'b.js'})
           , new File({path:'c.js'})
           , new File({path:'a.js'})
           , new File({path:'b.js'})
           , new File({path:'c.js'})
           ]
           , bundle.write)

    bundle.on('data', function(result) {
      result = escape(_.pluck([result], 'contents').join())

      test.equal('(function(){return"a"}())'
                 + 'return"b"'
                 + 'return"c"'
                 + 'module.exports={}require("test/a")require("test/b")require("test/c")', result)
    })
    .on('end', function() {
      test.equal(callCounts, 4)
      test.done()
    })
  }
};

function createBundle() { 
  var config = redefine.config()
    , result

  config.wrapper = 'empty'

  var __spy = function(config) {
      return spy = through.obj(function(m,e,n) {
        this.push(m)
        n()
      })
  }

  bundle = redefine.bundle(config, [__spy])
  var _files = []

  bundle.pipe(through.obj(function(result, enc, next) {
    _files.push(result)
    next()
  }, function() {
    this.push(_files)
  }))
}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}

