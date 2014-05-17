var ast = require('../ast/ast-adapter')
  , _ = require('underscore')

module.exports = function(config) {
  return function(module, modules, done) {
    if(!module.content) return

    var code = ast.parse(module.content, true)
      , converter = _.find(config.converters, function(converter) {
        return converter.resolver.match(code)
      })

    if(!converter) return

    var resolver = converter.resolver

    done({ name: resolver.name(code)
         , type: resolver.type
         , deps: resolver.deps(code)
         , params: resolver.params(code)
         , ast: resolver.func(code)
         , transform: _.partial(converter.transformer, module, _)
         })
  }
}
