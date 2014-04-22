var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(module, config) {
  var args = _.map(module.deps, function(d) { return config.normalize.args(d) })
    , fun = module.converter.func()

  return convertExpression(fun, args)

  function convertExpression(block, deps) {
    if(ast.is.object(block))
      return block

    if(ast.is.independentExpression(block) && deps && deps.length === 0)
      return resolveInlineDeps(block)

    return ast.create.iife(resolveParams(deps), block)

    function resolveInlineDeps(body) {
      return block.body.body[0].argument
    }

    function resolveParams(deps) {
      return _(deps).map(function(d) {
        return ast.create.id(d)
      })
    }
  }
}

