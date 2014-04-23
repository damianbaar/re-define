var ast = require('../ast/ast-adapter')
  , _ = require('underscore')

module.exports = function(config) {
  return {
    attachTo: function(module) {
      var code = ast.parse(module.content, true)
        , converter = _.find(config.converters, function(converter) { return converter.resolver.match(code) })
        , resolver

      resolver = converter.resolver

      return module.converter = {
        match: cache(resolver.match, code)
        , func: cache(resolver.func, code)
        , deps: cache(resolver.deps, code)
        , name: cache(resolver.name, code)
        , transform: cache(converter.transformer, module, config)
      }

      function cache(f){
        var memo = {}
          , key = module.name
          , args = _.rest(arguments)

        return function(){
          if(!memo[key])
            memo[key] = f.apply(this, args)

          return memo[key]
        }
      }
    }
  }
}