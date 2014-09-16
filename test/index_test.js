var _ = require('lodash')
  , fs = require('fs')
  , through = require('through2')
  , File = require('vinyl')
  , mock = require('mock-fs')
  , mockery = require('mockery')

var bundle

exports['re-define core'] = {
  setUp: function(cb) {
    var spy = function(name) {
      return function(config) { 
        return through.obj(function(chunk, enc, next) {
          this.push(chunk)
          next()
        })
      }
    }

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
    })

    mockery.registerMock('./file/load', 
      function(config) { 
        return through.obj(function(chunk, enc, next) {
          if(chunk.name === 'a' || chunk.name === 'b') {
            this.emit('exists', false, chunk)
            chunk.contents = null
          }
          this.push(chunk)
          next()
        })
      })

    mockery.registerMock('./transform/get-deps', spy('get-deps'))
    mockery.registerMock('./transform/get-ast', spy('get-ast'))
    mockery.registerMock('./transform/amd-to-cjs', spy('amd-to-cjs'))
    mockery.registerMock('./transform/escape-raw', spy('escape-raw'))
    mockery.registerMock('./transform/amd-plugin', spy('amd-plugin'))
    mockery.registerMock('./transform/convert-ast', spy('convert-ast'))
    mockery.registerMock('./transform/wrap-modules', spy('wrap-modules'))
    mockery.registerMock('./transform/rewrite-require', spy('rewrite-require'))
    mockery.registerMock('./transform/slice-bundles', spy('slice-bundles'))
    mockery.registerMock('./transform/sort-modules', spy('sort-modules'))

    createBundle()

    mock({
      'a.js': '(function() { return "a" })()'
    , 'b.js': 'define(function() { return "b" })'
    , 'c.js': 'define([], function() { return "c" })'
    })

    cb()
  },
  tearDown: function(cb) {
    mockery.deregisterAll()
    mockery.resetCache()
    mockery.disable()
    mock.restore()
    cb()
  },
  'load file once': function(test) {
    test.expect(2)

    mockery.registerMock('./file/load', 
      function(config) { 
        return through.obj(function(chunk, enc, next) {
          if(chunk.name === 'a') {
            this.emit('exists', false, chunk)
            chunk.contents = null
          }
          this.push(chunk)
          next()
        })
      })

    var f1 = new File({path: 'simple.js'})
    f1.contents = new Buffer('module.exports = {};require("a");require("b");require("c");')


    var f2 = new File({path: 'a.js'})
    f2.contents = new Buffer('module.exports = {}')
    f2.revert = function() {
      console.log('revert')
    }

    var f3 = new File({path: 'b.js'})
    f3.contents = new Buffer('module.exports = {}')
    f3.revert = function() {
      console.log('revert')
    }

    var f4 = new File({path: 'does-not-exists.js'})

    _.each([f1, f1, f2, f2, f3, f3, f4, f4], bundle.write)

    bundle.on('data', function(result) {
      test.equal(result.length, 4)
      test.equal([false,false,false,false].join(), _.pluck(result, 'pending').join())
    }).on('end', test.done)
  }
};

function createBundle() { 
  var redefine = require('re-define')
    , config = redefine.config()
    , result

  config.wrapper = 'empty'

  bundle = redefine.bundle(config)
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

