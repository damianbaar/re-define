var redefine = require('../lib')
  , _ = require('lodash')
  , fs = require('fs')
  , through = require('through2')
  , Module = require('re-define-module')
  , Module = require('re-define-module')
  , mock = require('mock-fs')

var bundle
  , spy

exports['integration'] = {
  setUp: function(cb) {

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
    cb()
  },
  'load dependencies and set namespace for require calls': function(test) {
    // var file = new Module({path: 'simple.js'})
    // file.contents = new Buffer('module.exports = {};require("a");require("b");require("c");')
    //
    // _.each([file], bundle.write)
    // //
    // bundle.on('data', function(result) {
    // test.done()
    //   // result = escape(_.pluck([result], 'contents').join())
    //   //
    //   // test.equal('(function(){return"a"}())'
    //   //            + 'return"b"'
    //   //            + 'return"c"'
    //   //            + 'module.exports={}require("project/a")require("project/b")require("project/c")', result)
    // })
    // .on('end', test.done)
    test.done()
  },
  'try to load duplicates': function(test) {
    var callCounts = 0
      , file

    // spy.pipe(through.obj(function(f,e,n) {
    //   if(f.stopProcessing !== true) callCounts++
    //
    //   this.push(f)
    //   n()
    // }))
    //
    file = new Module({path: 'simple.js'})
    file.contents = new Buffer('module.exports = {};require("a");require("b");require("c");')
debugger
    _.each([ file
           , new Module({path:'a.js'})
           , new Module({path:'b.js'})
           , new Module({path:'a.js'})
           , new Module({path:'b.js'})
           , new Module({path:'c.js'})
           ]
           , bundle.write)

    bundle.on('data', function(result) {
      result = escape(_.pluck([result], 'contents').join())

      test.equal('(function(){return"a"}())'
                 + 'return"b"'
                 + 'return"c"'
                 + 'module.exports={}require("project/a")require("project/b")require("project/c")', result)
    })
    .on('end', function() {
      test.equal(callCounts, 4)
      test.done()
    })
  },
  // 'not existing dependency': function(test) {
  //   var file
  //
  //   mock({
  //     'test/a.js': 'require("./lib/b");require("./lib/c");require("./foo/baz/d");require("does_not_exists")'
  //   , 'test/lib/b.js': 'require("does_not_exists")'
  //   , 'test/lib/c.js': 'require("does_not_exists")'
  //   , 'test/foo/baz/d.js': 'require("does_not_exists")'
  //   })
  //
  //   _.each([ new File({path:'test/a.js'})
  //          , new File({path:'test/lib/b.js'})
  //          , new File({path:'test/lib/a.js'})
  //          , new File({path:'test/foo/baz/d.js'})
  //          ]
  //          , bundle.write)
  //
  //
  //   bundle.on('data', function(result) {
  //     result = result.contents.toString()
  //
  //     var eR = "require('does_not_exists');"
  //            + "require('does_not_exists');"
  //            + "require('does_not_exists');"
  //            + "require('project/test/lib/b');"
  //            + "require('project/test/lib/c');"
  //            + "require('project/test/foo/baz/d');"
  //            + "require('does_not_exists');"
  //
  //     test.equal(escape(eR), escape(result))
  //   })
  //   .on('end', function() {
  //     test.done()
  //   })
  // }
};

function createBundle() { 
  var config = redefine.config()
    , result

  config.wrapper = 'empty'
  config.project = 'project'

  bundle = redefine.bundle(config)
  var _files = []

  bundle.pipe(through.obj(function(result, enc, next) {
    console.log(result)
    // _files.push(result)
    // next()
  }, function() {
    // this.push(_files)
  }))
}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}

