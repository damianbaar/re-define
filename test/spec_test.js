var fs = require('fs')
  , path = require('path')
  , testCase = require('nodeunit').testCase
  , sandbox = require('nodeunit').utils.sandbox
  , sinon = require('sinon')
  , _ = require('lodash')

exports['testing-bundles'] = testCase({

  "nested - structure with dependencies comming from node_modules (pattern: default)" 
: testCase({
    'create namespace and expose all modules': function(test) {
      var ctx = sandbox(path.resolve(__dirname, 'spec/nested/bundle.js'))
        , spec = ctx.spec

      test.equal(spec.nested.common, 'common')
      test.equal(spec.nested['a/b'], 'b')
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
      test.equal(keys.length, 2)

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
    }
  })
})
