var transform = require('../../lib/transform/rewrite-require')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
  , acorn = require('acorn')
  , through = require('through2')
  , escodegen = require('escodegen')
  , path = require('path')

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

    convert({internal: [m]}, function(f) {
      test.done()
    })
  },
  'rewrite file name when folder is the same what file is, d3/d3 -> d3': function(test) {
    var m = createModule('transform')

    m.update = function(val) {
      test.equal(val, 'transform')
    }

    convert({internal: [m]}, function(f) {
      test.done()
    })
  },
  'add folder to dependency name': function(test) {
    var m = createModule('foo/baz/bar')

    m.update = function(val) {
      test.equal(val, 'transform/foo/baz/bar')
    }

    convert({internal: [m]}, function(f) {
      test.done()
    })
  },
  'add project name to dependency name': function(test) {
    var m = createModule('foo/baz/bar')

    m.update = function(val) {
      test.equal(val, 'nanana/foo/baz/bar')
    }

    convert({internal: [m]}, function(f) {
      test.done()
    },{project:'nanana'})
  },
  'update references - files which where referenced from other modules but path points to the same file': function(test) {
    var m = createModule('foo/baz/bar')
      , ref1 = createModule('../baz/bar')

    m.references = ref1

    m.update = function(val) { test.equal(val, 'transform/foo/baz/bar') }
    ref1.update = function(val) { test.equal(val, 'transform/foo/baz/bar') }

    convert({internal: [m]}, function() { test.done() })
  },
  'group by base and align folders': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('index')

    m.base = '/bar'
    ref1.base = '/bar/node_modules/dep'

    m.update = function(val) { test.equal(val, 'bar/foo') }
    ref1.update = function(val) { test.equal(val, 'dep') }

    convert({internal: [m, ref1]}, function() { test.done() })
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

