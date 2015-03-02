var dep = require('./dep')

module.exports = function() {
  require(['using-external-require'], function(dep) {
    console.log('method called from external require', dep) 
  })

  return { name: dep.toUpperCase('index') }
}

