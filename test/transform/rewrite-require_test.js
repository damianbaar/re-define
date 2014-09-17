var transform = require('../../lib/transform/rewrite-require')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
  , acorn = require('acorn')
  , through = require('through2')
  , escodegen = require('escodegen')
  , path = require('path')
  , sinon = require('sinon')

var basedir = process.cwd()
exports['rewrite-require'] = {
  setUp: function(cb) {
    process.chdir(__dirname)
    cb()
  },
  tearDown: function(cb) {
    process.chdir(basedir)
    cb()
  },
  'rewrite index file to folder': function(test) {
    var m = createModule('index')

    m.update = function(val) {
      test.equal(val, 'transform')
    }

    convert([m], function(f) {
      test.done()
    })
  },
  'rewrite file name when folder is the same what file is, d3/d3 -> d3': function(test) {
    var m = createModule('transform')

    m.update = function(val) {
      test.equal(val, 'transform')
    }

    convert([m], function(f) {
      test.done()
    })
  },
  'add folder to dependency name': function(test) {
    var m = createModule('foo/baz/bar')

    m.update = function(val) {
      test.equal(val, 'transform/foo/baz/bar')
    }

    convert([m], function(f) {
      test.done()
    })
  },
  'add project name to dependency name': function(test) {
    var m = createModule('foo/baz/bar')

    m.update = function(val) {
      test.equal(val, 'nanana/foo/baz/bar')
    }

    convert([m], function(f) {
      test.done()
    },{project:'nanana'})
  },
  'update references - files which where referenced from other modules but path points to the same file': function(test) {
    var m = createModule('foo/baz/bar')
      , ref1 = createModule('../baz/bar')

    m.references = ref1

    m.update = function(val) { test.equal(val, 'transform/foo/baz/bar') }
    ref1.update = function(val) { test.equal(val, 'transform/foo/baz/bar') }

    convert([m], function() { test.done() })
  },
  'group by base and align folders': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('index')

    m.base = '/bar'
    ref1.base = '/bar/node_modules/dep'

    m.update = function(val) { test.equal(val, 'bar/foo') }
    ref1.update = function(val) { test.equal(val, 'dep') }

    convert([m, ref1], function() { test.done() })
  },
  'revert external modules': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('index')
      , a = createModule('a', true)
      , b = createModule('b', true)
      , revert = sinon.spy() 
      , update = sinon.spy()

    a.revert = b.revert = revert
    m.update = ref1.update = update

    m.base = '/bar'
    m.contents = new Buffer('require("a");require("b")')

    ref1.base = '/bar/node_modules/dep'

    convert([m, ref1, a, b], function() { 
      test.equal(2, revert.callCount)
      test.equal(2, update.callCount)
      test.done() 
    })
  },
  'flat folder structure with external': function(test) {

    var m1 = createModule('foo')
      , n1 = createModule('modules/n1')
      , n2 = createModule('modules/n2')

    m1.base = '/baz'
    n1.base = n2.base = '/node_modules/dep'
    
    //this one wont be converted - entry point for external lib
    n1.external = true

    convert([m1, n1, n2], function(result) { 
      test.equal(['baz/foo', 'modules/n1', 'dep/modules/n2'].join(), _.pluck(result, 'name').join())
      test.equal(2, _.compact(_.pluck(result, 'external')).length)
      test.done() 
    })
  }
}

function createModule(name, empty) {
  var m = Module({path: name + ".js", name: name});
  !empty && (m.contents = new Buffer(""))
  return m
}

function convert(file, done, config) {
  stream = transform(redefine.config(config))
                .on('data', function(f) {
                  done(f)
                })

  stream.write(file)
}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}

