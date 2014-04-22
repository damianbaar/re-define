var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(module, config) {
    var name = module.name
      , deps = module.deps
      , fun = module.converter.func()

  return 'var ' + name + ' = ' + ast.generate(convertExpression(fun, deps), config.formatter)

  function convertExpression(block, deps) {
    if(ast.is.object(block))
      return block

    if(ast.is.independentExpression(block) && deps && deps.length === 0)
      return resolveInlineDeps(block)

    return ast.create.iife(resolveElements(deps), block)

    function resolveInlineDeps(body) { return block.body.body[0].argument }
    function resolveElements(deps) { return _(deps).map(function(d) { return ast.create.id(d) })
    }
  }
}

