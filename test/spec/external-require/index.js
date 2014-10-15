var dep = require('./dep')
  , usingExternalRequire = require(['using-external-require'], function() {
      console.log('method called from external require') 
  })

module.exports = { name: dep.toUpperCase('index')
                 , ext: require(['external-require'], function(ext) {
                    console.log(ext)
                 })
                 }

setTimeout(function() {
  require(['using-external-require'], function(dep) {
    console.log('method called from external require', dep) 
  })
})
