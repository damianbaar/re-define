var dep = require('./dep')
  , usingExternalRequire = require(['using-external-require'], function() {})

module.exports = { name: dep.toUpperCase('index')
                 , ext: usingExternalRequire }
