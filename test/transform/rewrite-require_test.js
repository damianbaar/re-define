var transform = require('../../lib/transform/rewrite-require')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
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
  'add project name to dependency name': function(test) {
    var m = createModule('foo/baz/bar')

    m.update = function(val) {
      test.equal(val, 'proj/foo/baz/bar')
    }

    convert([m], function(f) {
      test.done()
    }, {project: 'proj'})
  },
  'empty project name': function(test) {
    var m = createModule('foo/baz/bar')

    m.update = function(val) {
      test.equal(val, 'foo/baz/bar')
    }

    convert([m], function(f) {
      test.done()
    }, {project: null})
  },
  'update references - files which where referenced from other modules but path points to the same file': function(test) {
    var m = createModule('foo/baz/bar1')
      , ref1 = createModule('foo/baz/bar2')
      , spy = sinon.spy()

    m.references = ref1

    m.update = spy
    ref1.update = spy

    convert([m], function() { 
      test.equal(2, spy.callCount)
      test.done() 
    })
  },
  'group by base and align folders': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('index')

    m.base = process.cwd()

    ref1.base = '/node_modules/dep'
    ref1.requiredAs = 'dep'
    ref1.path = ref1.base + '/' + ref1.name + '.js'
    ref1.external = true

    m.update = function(val) { test.equal(val, 'nana/foo') }
    ref1.update = function(val) { test.equal(val, 'dep') }

    convert([m, ref1], function() { test.done() }, {project:'nana'})
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
  'flat structure for folders': function(test) {

    var m1 = createModule('foo')
      , n1 = createModule('n1')
      , n2 = createModule('n2')
      , n3 = createModule('n3')

    m1.base = process.cwd()

    n1.base = n2.base = process.cwd() + '/node_modules/'
    n1.path = path.join(n1.base, './n1/n1.js') 
    n2.path = path.join(n2.base, './n2/n2.js') 

    n3.base = process.cwd() + '/bower_components/'
    n3.path = path.join(n3.base, './n3/index.js') 

    n1.requiredAs = 'n1'
    n2.requiredAs = 'n2'
    n3.requiredAs = 'n3'

    convert([m1, n1, n2, n3], function(result) { 
      test.equal(['test/foo', 'n1', 'n2', 'n3'].join(), _.pluck(result, 'name').join())
      test.equal(3, _.compact(_.pluck(result, 'external')).length)
      test.done() 
    }, {project: 'test', cwd: process.cwd()})
  }
}

function createModule(name, empty, requiredAs) {
  var m = Module({path: name + ".js", name: name, requiredAs: requiredAs});
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

