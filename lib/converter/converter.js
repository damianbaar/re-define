var ast = require('../ast/ast-adapter')
  , _ = require('underscore')

module.exports = function(config) {
  return function(module, modules, done) {
    if(!module.content) return

    var code = ast.parse(module.content, true)
      , converter = _.find(config.converters, function(converter) {
        return converter.match(code)
      })

    if(!converter) {
      console.log('Missing converter for: ', module)
      return
    }

    return done(converter.attach(module, code))
  }
}
