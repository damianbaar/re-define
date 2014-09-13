var transform = require('../../lib/transform/sort-modules')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
  , acorn = require('acorn')
  , through = require('through2')
  , escodegen = require('escodegen')

exports['sort-modules'] = {
  'sort files': function(test) {
    var d1 = createModule('dep1')

    var d2 = createModule('dep2')
    d2.dependencies = [d1]

    var m = createModule('main')
    m.dependencies = [d1,d2]

    convert([d2, m, d1], function(bundle) {
      test.equal(['dep1', 'dep2', 'main'].join(), _.pluck(bundle.internal, 'name').join())
      test.equal(bundle.external.length, 0)
      test.done()
    })
  },
  'do not treat empty module as external when file exists': function(test) {
    var d1 = createModule('dep1')
    var d1_empty = createModule('dep1', true)

    var m = createModule('main')
    m.dependencies = [d1]

    convert([m, d1, d1_empty, d1_empty], function(bundle) {
      test.equal(['dep1', 'main'].join(), _.pluck(bundle.internal, 'name').join())
      test.equal(bundle.internal.length, 2)
      test.equal(bundle.external.length, 0)
      test.done()
    })
  },
}

function createModule(name, empty) {
  var m = Module({path: name + ".js", name: name});
  !empty && (m.contents = new Buffer(""))
  return m
}

function convert(files, done) {
  var sort = transform(redefine.config())
              .on('data', function(bundles) {
                done(bundles)
              })

  sort.write(files)
}
