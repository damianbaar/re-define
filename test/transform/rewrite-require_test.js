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
  'rewrite main index file to project': function(test) {
    var m = createModule('index')
    m.path = path.join(process.cwd(), 'index.js')
    m.base = process.cwd()
    m.requiredAs = './index'

    m.update = function(val) {
      test.equal(val, 'transform')
    }

    convert([m], function(f) {
      test.done()
    }, {project: 'transform'})
  },
  'rewrite nested index file to folder when project name is defined': function(test) {
    var m = createModule('a')
    m.path = path.join(process.cwd(), 'a/index.js')
    m.requiredAs = './index'

    m.update = function(val) {
      test.equal(val, 'transform/a')
    }

    convert([m], function(f) {
      test.done()
    }, {project: 'transform'})
  },
  'rewrite nested index file to folder when project name is not defined': function(test) {
    var m = createModule('index')
    m.path = path.join(process.cwd(), 'a/index.js')
    m.name = 'a/index'
    m.requiredAs = './index'

    m.update = function(val) {
      test.equal(val, 'transform/a')
    }

    convert([m], function(f) {
      test.done()
    })
  },
  'get folder as a prefix for modules from config.cwd': function(test) {
    var cwd = process.cwd() + '/test-project' 

    var m = createModule('transform')

    m.path = cwd + '/dep.js'
    m.base = cwd

    m.update = function(val) { test.equal(val, 'test-project/dep') }

    convert([m], function(f) {
      test.done()
    }, { cwd: cwd })
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
      test.equal(val, 'transform/foo/baz/bar')
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

    ref1.base = m.base + '/node_modules/dep'
    ref1.path = ref1.base + '/' + ref1.name + '.js'
    ref1.external = true

    m.update = function(val) { test.equal(val, 'nana/foo') }
    ref1.update = function(val) { test.equal(val, 'dep') }

    convert( [m, ref1]
           , function() { test.done() }
           , { project:'nana', discoverable: ['node_modules']})
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

    a.requiredAs = 'a'
    b.requiredAs = 'b'

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

    n1.external = n2.external = n3.external = true

    convert([m1, n1, n2, n3], function(result) { 
      test.equal(['test/foo', 'n1/n1', 'n2/n2', 'n3'].join(), _.pluck(result, 'name').join())
      test.equal(3, _.compact(_.pluck(result, 'external')).length)
      test.done() 
    }, {project: 'test', cwd: process.cwd(), discoverable: ['node_modules', 'bower_components']})
  },
  'windows paths with grouping': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('bar')
      , ref2 = createModule('baz')
      , base = _.partial(path.join, process.cwd())

    m.path = base(m.name + '.js')

    ref1.path = base('/node_modules/comp', ref1.name + '.js')
    ref2.path = base('/node_modules/comp/a', ref2.name + '.js')

    m.path = windowsPath(m.path)
    ref1.path = windowsPath(ref1.path)
    ref2.path = windowsPath(ref2.path)

    m.update = function(val) { test.equal(val, 'nana/foo') }
    ref1.update = function(val) { test.equal(val, 'comp/bar') }
    ref2.update = function(val) { test.equal(val, 'comp/a/baz') }

    convert( [m, ref1, ref2]
           , function() { test.done() }
           , { project:'nana', discoverable: ['node_modules']})
  },
  'windows paths with pkg name': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('bar')
      , ref2 = createModule('baz')
      , base = _.partial(path.join, process.cwd())

    m.path = base(m.name + '.js')

    ref1.path = base('/node_modules/comp', ref1.name + '.js')
    ref2.path = base('/node_modules/comp/a', ref2.name + '.js')

    ref1.pkgName = 'component'
    ref1.descriptor = {}

    m.path = windowsPath(m.path)
    ref1.path = windowsPath(ref1.path)
    ref2.path = windowsPath(ref2.path)

    m.update = function(val) { test.equal(val, 'nana/foo') }
    ref1.update = function(val) { test.equal(val, 'component') }
    ref2.update = function(val) { test.equal(val, 'component/a/baz') }

    convert( [m, ref1, ref2]
           , function() { test.done() }
           , { project:'nana', discoverable: ['node_modules']})
  },
  'detect nearest lib folder when rewriting dependency': function(test) {
    var m = createModule('foo')
      , ref1 = createModule('bar')
      , ref2 = createModule('baz')
      , base = _.partial(path.join, process.cwd())

    m.path = base(m.name + '.js')

    ref1.path = base('/node_modules/a/bower_components/b/node_modules/comp', ref1.name + '.js')
    ref2.path = base('/node_modules/a/bower_components/comp/a', ref2.name + '.js')

    m.path = windowsPath(m.path)
    ref1.path = windowsPath(ref1.path)
    ref2.path = windowsPath(ref2.path)

    ref2.pkgName = 'comp'

    m.update = function(val) { test.equal(val, 'nana/foo') }
    ref1.update = function(val) { test.equal(val, 'comp/bar') }
    ref2.update = function(val) { test.equal(val, 'comp/a/baz') }

    convert( [m, ref1, ref2]
           , function() { test.done() }
           , { project:'nana', discoverable: ['node_modules', 'bower_components']})
  }
}

function windowsPath(path) { return path.replace(/\//g,'\\') }

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

