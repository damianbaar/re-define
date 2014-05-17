var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(module, modules) {
  var args = module.deps
    , fun = module.ast

  return convertExpression(fun, args)

  function convertExpression(block, deps) {
    if(ast.is.object(block))
      return block

    if(ast.is.independentExpression(block) && deps && deps.length === 0)
      return resolveInlineDeps(block)
    
    return ast.create.iife(resolveArgs(deps), block)

    function resolveInlineDeps(block) {
      return block.body.body[0].argument
    }

    function resolveArgs(deps) {
      return _(deps).map(function(d) {
        return ast.create.id(d)
      })
    }
  }
}

