var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(module, modules) {
  var deps = module.deps
    , func = module.ast
    , args = _(deps).map(function(d) { return ast.create.id(d) })

  return ast.create.expressionStatement(args, func)
}

