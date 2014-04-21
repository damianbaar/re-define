var ast = require('../ast/ast-adapter')
  , _ = require('underscore')

module.exports = function(converters) {
  return {
    attachTo: function(module) {
      var code = ast.parse(module.content, true)[0]
        , converter = _.find(converters, function(converter) { return converter.resolver.match(code) })
        , resolver

      resolver = converter.resolver

      return module.converter = {
        match: _.partial(resolver.match, code)
        , func: _.partial(resolver.func, code)
        , deps: _.partial(resolver.deps, code)
        , name: _.partial(resolver.name, code)
        , params: _.partial(resolver.params, code)
        , transform: _.partial(converter.transformer, module)
      }
    }
  }
}