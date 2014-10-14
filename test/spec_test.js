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
      test.equal(keys.length, 3)

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

      test.equal(code['a'], 'a')
      test.equal(code['a/c'], 'c')
      test.equal(code['a/b'], 'b')
      test.equal(code['a/b/d'], 'd')
      test.equal(code['a/b/d/e'], 'e')
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
      test.expect(2)

      var globals = { require: function(a) {
        test.equal(arguments.length, 2)
        return 'external-require'
      }}

      var ctx = sandbox(path.resolve(__dirname, 'spec/external-require/bundle.js'), globals)
        , code = ctx.spec.external

      test.ok(code.test.ext === 'external-require')
      test.done()
    }
  })
})
