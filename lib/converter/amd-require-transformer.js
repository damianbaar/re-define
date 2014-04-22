var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(module, config) {
  var deps = module.deps
    , func = module.converter.func()
    , args = _(deps).map(function(d) { return ast.create.id(d) })

  return ast.generate(ast.create.expressionStatement(args, func))
}
