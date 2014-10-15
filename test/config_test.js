var _ = require('lodash')

exports['config'] = {
  'override booleans': function(test) {
    var redefine = require('../lib')
      , config = redefine.config({showWarnings:false})

    test.ok(!config.showWarnings)
    test.done()
  }
};


