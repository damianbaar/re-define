var transform = require('../../lib/transform/amd-to-cjs')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
  , acorn = require('acorn')
  , through = require('through2')
  , escodegen = require('escodegen')

exports['amd-to-cjs'] = {
  'require-function': function(test) {
    convert('require(function() { return "test" })', function(r) {
      test.equal('exports = \'test\';', r)
      test.done()
    })
  },

  'require-function-with-empty-array': function(test) {
    convert('require([], function() { return "test" })', function(r) {
      test.equal('exports = \'test\';', r)
      test.done()
    })
  },

  'define-function': function(test) {
    convert('define(function() { return "test" })', function(r) {
      test.equal('exports = \'test\';', r)
      test.done()
    })
  },

  'define-function-with-empty-array': function(test) {
    convert('define([], function() { return "test" })', function(r) {
      test.equal('exports = \'test\';', r)
      test.done()
    })
  },

  'define-with-object': function(test) {
    convert('define({test:"test"})', function(r) {
      test.equal('exports = { test: \'test\' };', r)
      test.done()
    })
  }
}

function convert(code, done) {
    var file = Module({path: 'x.js'})
    file.contents = acorn.parse(code)

    var amd = transform(redefine.config())
                .on('data', function(file) {
                  done(escodegen.generate(file.contents))
                })

    amd.write(file)
}
