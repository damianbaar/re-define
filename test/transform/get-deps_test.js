var transform = require('../../lib/transform/get-deps')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
  , acorn = require('acorn')
  , through = require('through2')
  , escodegen = require('escodegen')
  , path = require('path')

exports['get-deps'] = {
  'resolve dependencies and check how many times is called writer': function(test) {

    var m = createModule('main')
    m.contents = acorn.parse('require("dep1");require("dep2");')

    var writeCount = 0

    convert(m, function(f) {
      test.equal(_.pluck(f.dependencies, 'name').join(), ['dep1','dep2'].join())
      test.equal(writeCount, 2)
      test.done()
    }, function(f) {
      writeCount++
    })
  },
  'rewrite dependencies': function(test) {
    var m = createModule('main')
    m.contents = acorn.parse('require("dep1");require("dep2");')

    var writeCount = 0

    convert(m, function(file) {
      var prefix = 'foo/baz/'

      _.each(file.dependencies, function(f) { f.update(prefix + f.name) })

      var contents = escodegen.generate(file.contents)
      test.equal(escape("require('foo/baz/dep1');require('foo/baz/dep2');"), escape(contents))
      test.done()
    })
  },
  'remap dependency': function(test) {
    var m = createModule('main')
      , config = redefine.config()

    m.contents = acorn.parse('require("dep1");')

    config.map = {"dep1":"foo/baz/bar"}

    var stream = transform(config, through.obj())
                  .on('data', function(f) {
                    test.equal(escape('require("foo/baz/bar");'), escape(escodegen.generate(f.contents)))
                    test.done()
                  })

    stream.write(m)
  },
  'check dependencies - root': function(test) {
    var base = '/foo/baz/'
      , m = createModule('main')

    m.path = base + 'main.js'
    m.base = base
    m.contents = acorn.parse('require("./dep1");')

    convert(m, function(file) {
      var dep = file.dependencies[0]
      test.equal(dep.base, m.base)
      test.equal(dep.name, 'dep1')
      test.done()
    })
  },
  'check dependencies - outside folder': function(test) {
    var base = '/foo/baz/bar'
      , m = createModule('test')

    m.path = path.join(process.cwd(), base, 'main.js')
    m.contents = acorn.parse('require("../test/dep1");')

    convert(m, function(file) {
      var dep = file.dependencies[0]
      test.equal(dep.base, m.base)
      test.equal(dep.name, 'foo/baz/test/dep1')
      test.done()
    })
  }
  
}

function createModule(name, empty) {
  var m = Module({path: name + ".js", name: name});
  !empty && (m.contents = new Buffer(""))
  return m
}

function convert(file, done, write) {
  var writer = through.obj(function(chunk, enc, next) {
    write && write(chunk)
    next()
  })

  var stream = transform(redefine.config(), writer)
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
