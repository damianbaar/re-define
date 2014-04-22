var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(module, config) {
  var deps = module.deps
    , func = module.converter.func()
    , args = _(deps).map(function(d) { return config.normalize.args(ast.create.id(d)) })

  return ast.create.expressionStatement(args, func)
}

