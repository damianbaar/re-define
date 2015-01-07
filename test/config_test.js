var _ = require('lodash')

exports['config'] = {
  'override booleans': function(test) {
    var redefine = require('../lib')
      , config = redefine.config({showWarnings:false})

    test.ok(!config.showWarnings)
    test.done()
  },

  'to array': function(test) {
    var redefine = require('../lib')
      , config = redefine.config({})
      , _toString = config.helpers.toString

    test.equal(_toString([1,2,3,4,5]), '[\'1\',\'2\',\'3\',\'4\',\'5\']')
    test.equal(_toString([1,1,1]), "['1']")
    test.equal(_toString(['a','a']), "['a']")
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
  }

}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}


