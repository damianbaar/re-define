var matcher = require('../matcher')
  , _ = require('underscore')
  , ast = require('../ast-adapter')

module.exports = {
  match: match
  , convert: convert
}

function match(content) {
  return matcher.isAMDExpression('require', content)
}

function convert(callExpression, config) {
  var expression = callExpression.expression.arguments
    , deps = expression[0].elements
    , callee  = expression[1]
    , args

  args = alterDeps(deps, function(d) {
    return ast.create.id(config.shim(d.value))
  })

  return { ast: ast.create.expressionStatement(args, callee)
         , deps: alterDeps(deps, function(v) { return v.value})
         }

  function alterDeps(deps, resolve) {
    return _(deps).map(function(d) {
      return resolve(d)
    })
  }
}

