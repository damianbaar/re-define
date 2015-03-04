var fs = require('fs')
  , path = require('path')
  , testCase = require('nodeunit').testCase
  , _sandbox = require('nodeunit').utils.sandbox
  , sinon = require('sinon')
  , _ = require('lodash')

sandbox = function(file, globals) {
  return _sandbox(file, _.extend(globals || {}, { window: {} }) )
}
exports['testing-bundles'] = testCase({

  "nested dependencies - structure with dependencies comming from node_modules (pattern: default)" 
: testCase({
    'create namespace and expose all modules': function(test) {
      var ctx = sandbox(
        [ path.resolve(__dirname, 'spec/nested-dependencies/bundle.js')
        , path.resolve(__dirname, 'spec/nested-dependencies/__run__.js')]
        , {})
        , spec = ctx.spec

      test.equal(spec.nested['common/common'].exports, 'common')
      test.equal(spec.nested['common'].exports, 'common/index')
      test.equal(spec.nested['d/d'].exports, 'd')
      test.equal(spec.nested['a/c'].exports, 'c')
      test.equal(spec.nested['a/c'].exports, 'c')
      test.equal(spec.nested['test'].exports, 'main')

      test.done()
    }
  }),

  "umd - exporting values"
: testCase({
    'expose only factory function': function(test) {
      var ctx = sandbox(path.resolve(__dirname, 'spec/umd/bundle.js'))
        , global = ctx.umd.module
        , keys = _.keys(global)

      test.equal(keys[0], 'dep')
      test.equal(keys[1], 'name')
      test.equal(keys.length, 4)

      test.done()
    },

    'check global': function(test) {
      var ctx = sandbox(path.resolve(__dirname, 'spec/umd/bundle.js'))
        , umd = ctx.umd

      test.equal(umd.module.toString(), {name:'umd', dep: 'dep'})

      test.done()
    },

    'check cjs': function(test) {
      var globals = {module: {exports: {}}}
        , ctx = sandbox(path.resolve(__dirname, 'spec/umd/bundle.js'), globals)

      test.equal(globals.module.exports.toString(), {name:'umd', dep: 'dep'})

      test.done()
    },

    'check amd': function(test) {
      var globals = {define: sinon.spy()}
      globals.define.amd = true

      var ctx = sandbox(path.resolve(__dirname, 'spec/umd/bundle.js'), globals)

      test.equal(globals.define.calledOnce, 1)
      test.equal(globals.define.getCall(0).args[0], 'umd/module')
      test.ok(typeof globals.define.getCall(0).args[2] === "function")
      test.ok(globals.define.getCall(0).args[2]().toString(), {name:'umd', dep:'dep'})

      test.done()
    },

    'json as object': function(test) {
      var ctx = sandbox(path.resolve(__dirname, 'spec/umd/bundle.js'))
      test.ok(ctx.umd.module.data.test)
      test.done()
    }
  }),

  "multiple-entry-points"
: testCase({
    'exposing modules': function(test) {
      var ctx = sandbox(
        [path.resolve(__dirname, 'spec/multiple-entry-points/bundle.js'),
         path.resolve(__dirname, 'spec/multiple-entry-points/__run__.js')],
         { exports: {} })
        , code = ctx.spec.multi

      test.equal(code['test/dep'].exports.name, 'dep')
      test.equal(code['test'].exports, 'INDEX')
      test.equal(code['test/entry1'].exports, 'ENTRY1')
      test.equal(code['test/entry2'].exports, 'ENTRY2')

      test.done()
    },
  }),

  "referencing-nested-files"
: testCase({
    'exposing modules within namespace': function(test) {
      var globals = {
          window: {},
          module: {exports: {}}
        }

      var ctx = sandbox(
        [ path.resolve(__dirname, 'spec/referencing-nested-files/bundle.js'),
          path.resolve(__dirname, 'spec/referencing-nested-files/__run__.js')
        ], globals)
        , code = ctx.spec.refs

      test.equal(code['a'].exports, 'a')
      test.equal(code['a/c'].exports, 'c')
      test.equal(code['a/b'].exports, 'b')
      test.equal(code['a/b/d'].exports, 'd')
      test.equal(code['a/b/d/e'].exports, 'e')
      test.equal(code['refs'].exports, 'refs')

      test.done()
    }
  }),

  "index"
: testCase({
    'look-at-index-file': function(test) {
      var globals = { require: sinon.spy() }
        , ctx = sandbox(
          [ path.resolve(__dirname, 'spec/index/bundle.js'),
            path.resolve(__dirname, 'spec/index/__run__.js') ]
        , globals)
        , code = ctx.spec

      test.equal(code.index.test.exports, 'INDEX')
      test.ok(code.index['test/dep'].exports.toUpperCase)
      test.done()
    },
    'show-warnings': function(test) {
      var code = fs.readFileSync(path.resolve(__dirname, 'spec/index/bundle.js'), 'utf-8')

      test.ok(code.indexOf('//warning') === -1)
      test.done()
    }
  }),

  "external-require"
: testCase({
    'take a dep from external require': function(test) {
      test.expect(1)

      var globals = { 
        require: function(a) {
          test.ok(arguments.length > 0)
          return 'external-require'
        },
        console: console
      }

      var ctx = sandbox([
            path.resolve(__dirname, 'spec/external-require/bundle.js'),
            path.resolve(__dirname, 'spec/external-require/__run__.js')
            ], globals)

      test.done()
    }
  }),

  "amd - global - exporting values"
: testCase({
    'amd and global with one factory': function(test) {
      var globals = {window: {}, define: sinon.spy(), require: function() { return ''}}
      globals.define.amd = true

      var ctx = sandbox(path.resolve(__dirname, 'spec/amd-global/bundle.js'), globals)
        , global = ctx['amd-global'].module

      test.equal(globals.define.calledOnce, 1)
      test.equal(globals.define.getCall(0).args[0], 'amd-global/module')
      test.ok(typeof globals.define.getCall(0).args[1] === "function")

      test.ok(global === globals.define.getCall(0).args[1]())
      test.done()
    }
  })

, "iife"
: testCase({
    'attach to global': function(test) {
      var globals = {window: {}}
        , ctx = sandbox(path.resolve(__dirname, 'spec/iife/bundle.js'), globals)
        , global = ctx

      test.ok(globals.window.test)
      test.ok(globals.window.test.dep)
      test.ok(globals.window.test.name)
      test.done()
    }
  })

, "referencing from index"
: testCase({
    'correct initialization': function(test) {
      var globals = {require: function(a) {
        throw new Error('It should not be called as all deps are there', a)
      }}
        , ctx = sandbox(
          [ path.resolve(__dirname, 'spec/referencing-from-index/bundle.js'),
          , path.resolve(__dirname, 'spec/referencing-from-index/__run__.js')]
          , globals)
        , code = ctx.spec.refs

      test.ok(_.has(code, 'refs/common'))
      test.ok(_.has(code, 'refs/dep'))
      test.ok(_.has(code, 'refs/dep2'))
      test.ok(_.has(code, 'refs/common-2'))
      test.ok(_.has(code, 'refs'))
      test.equal(code['refs'].exports, 'index')

      test.done()
    }
  })

, "globals"
: testCase({
    'detect globals': function(test) {
      var globals = {window: {}, define: sinon.spy(), console: console}
        , ctx = sandbox(path.resolve(__dirname, 'spec/globals/bundle.js'), globals)
        , global = globals.window.amd.global

      test.equal(global.filename, 'index.js')
      test.equal(global.dirname, '.')
      test.ok(globals.define.notCalled)
      test.done()
    }
  })
})
