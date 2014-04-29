var ast = require('../ast/ast-adapter')
  , _ = require('underscore')

module.exports = function(converters) {
  return function(content, done) {
    if(!content) return

    var code = ast.parse(content, true)
      , converter = _.find(converters, function(converter) {
        return converter.resolver.match(code)
      })

    if(!converter) return

    var resolver = converter.resolver

    done({ name: resolver.name(code)
         , type: resolver.type
         , deps: resolver.deps(code)
         , ast: resolver.func(code)
         , transform: converter.transformer
         })
  }
}