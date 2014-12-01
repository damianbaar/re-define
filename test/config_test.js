var _ = require('lodash')

exports['config'] = {
  'override booleans': function(test) {
    var redefine = require('../lib')
      , config = redefine.config({showWarnings:false})

    test.ok(!config.showWarnings)
    test.done()
  },

  'globalize': function(test) {
    var redefine = require('../lib')
      , globalize = _.partialRight(redefine.config().helpers.toGlobal, 'factory()')

    test.equal( escape(globalize('window.test-test'.split('.')))
              , escape('window["test-test"] = factory()'))

    test.equal( escape(globalize('a.b.c.d'.split('.')))
              , escape( 'a["b"] = parent["b"] || {};\n'
                      + 'a["b"]["c"] = parent["b"]["c"] || {};\n'
                      + 'a["b"]["c"]["d"] = factory();\n'))

    test.done()
  },

  'safe var initialization': function(test) {
    var redefine = require('../lib')
      , safeInit = redefine.config().helpers.safeInit

    test.equal( escape(safeInit('process.env'))
              , escape('var process = process || {};process.env = process.env || {};'))

    test.done()
  }

}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}


