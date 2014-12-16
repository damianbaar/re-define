var fs = require('fs')
  , path = require('path')
  , testCase = require('nodeunit').testCase
  , sandbox = require('nodeunit').utils.sandbox
  , sinon = require('sinon')
  , _ = require('lodash')

exports['testing-bundles'] = testCase({

  "nested dependencies - structure with dependencies comming from node_modules (pattern: default)" 
: testCase({
    'create namespace and expose all modules': function(test) {
      var ctx = sandbox(path.resolve(__dirname, 'spec/nested-dependencies/bundle.js'))
        , spec = ctx.spec

      test.equal(spec.nested['common/common'], 'common')
      test.equal(spec.nested['common'], 'common/index')
      test.equal(spec.nested['d/d'], 'd')
      test.equal(spec.nested['a/c'], 'c')
      test.equal(spec.nested['a/c'], 'c')
      test.equal(spec.nested['test'], 'main')

      test.done()
    }
  })

, "umd - exporting values"
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
      var ctx = sandbox(path.resolve(__dirname, 'spec/multiple-entry-points/bundle.js'))
        , code = ctx.spec.multi

      test.equal(code['test/dep'].name, 'dep')
      test.equal(code['test'], 'INDEX')
      test.equal(code['test/entry1'], 'ENTRY1')
      test.equal(code['test/entry2'], 'ENTRY2')

      test.done()
    },
  }),

  "referencing-nested-files"
: testCase({
    'exposing modules': function(test) {
      var ctx = sandbox(path.resolve(__dirname, 'spec/referencing-nested-files/bundle.js'))
        , code = ctx.spec.refs

      test.equal(code['module-a'], 'a')
      test.equal(code['module-a/c'], 'c')
      test.equal(code['module-a/b'], 'b')
      test.equal(code['module-a/b/d'], 'd')
      test.equal(code['module-a/b/d/e'], 'e')
      test.equal(code['refs'], 'refs')

      test.done()
    }
  }),

  "index"
: testCase({
    'look-at-index-file': function(test) {
      var globals = { require: sinon.spy() }
        , ctx = sandbox(path.resolve(__dirname, 'spec/index/bundle.js'), globals)
        , code = ctx.spec

      test.ok(code.index.test)
      test.ok(code.index['test/dep'])
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
      test.expect(4)

      var globals = { 
        require: function(a) {
          test.ok(arguments.length > 0)
          return 'external-require'
        },
        setTimeout: function(a) {
          a()
        }
      }

      var ctx = sandbox(path.resolve(__dirname, 'spec/external-require/bundle.js'), globals)
        , code = ctx.spec.external

      test.ok(code.test.ext === 'external-require')
      test.done()
    }
  })

, "amd - global - exporting values"
: testCase({
    'amd and global with one factory': function(test) {
      var globals = {define: sinon.spy()}
      globals.define.amd = true

      var ctx = sandbox(path.resolve(__dirname, 'spec/amd-global/bundle.js'), globals)
        , global = ctx.amd_global.module

      test.equal(globals.define.calledOnce, 1)
      test.equal(globals.define.getCall(0).args[0], 'amd-global/module')
      test.ok(typeof globals.define.getCall(0).args[2] === "object")

      test.ok(global === globals.define.getCall(0).args[2])
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
        , ctx = sandbox(path.resolve(__dirname, 'spec/referencing-from-index/bundle.js'), globals)
        , code = ctx.spec.refs

      test.ok(_.has(code, 'refs/common'))
      test.ok(_.has(code, 'refs/dep'))
      test.ok(_.has(code, 'refs/dep2'))
      test.ok(_.has(code, 'refs/common-2'))
      test.ok(_.has(code, 'refs'))
      test.equal(code['refs'], 'index')

      test.done()
    }
  })

, "globals"
: testCase({
    'detect globals': function(test) {
      var globals = {window: {}, define: sinon.spy()}
        , ctx = sandbox(path.resolve(__dirname, 'spec/globals/bundle.js'), globals)
        , global = globals.window.amd.global

      test.equal(global.filename, 'index.js')
      test.equal(global.dirname, '.')
      test.ok(globals.define.notCalled)
      test.done()
    }
  })
})
