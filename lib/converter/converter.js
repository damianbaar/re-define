var ast = require('../ast/ast-adapter')
  , _ = require('underscore')

module.exports = function(config) {
  return function(module, modules, done) {
    if(!module.content) return

    var code = ast.parse(module.content, true)
      , converter = _.find(config.converters, function(converter) {
        return converter.match(code)
      })

    if(!converter) return

    done({ name: converter.name(code)
         , type: converter.type
         , deps: converter.deps(code)
         , params: converter.params(code)
         , ast: converter.func(code)
         , variable: converter.variable
         , transform: _.partial(converter.transform, module)
         })
  }
}
