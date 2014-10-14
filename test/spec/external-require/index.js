var dep = require('./dep')
  , usingExternalRequire = require(['using-external-require'], function() {
      console.log('method called from external require') 
  })

module.exports = { name: dep.toUpperCase('index')
                 , ext: usingExternalRequire }

