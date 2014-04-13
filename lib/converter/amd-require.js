var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , convert: convert
  , resolve: function() {} //TODO attach resolver here
}

function match(content) {
  return ast.is.amd('require', content)
}

function convert(expressionStatement, config) {
  var expression = ast.get.expressionArgs(expressionStatement)
    , elements = expression[0].elements
    , callee  = expression[1]
    , args

  args = resolveElements(elements, function(d) {
    return ast.create.id(config.shim(d.value))
  })

  return { ast: ast.create.expressionStatement(args, callee)
         , deps: resolveElements(elements, function(v) { return v.value })
         }

  function resolveElements(deps, resolve) {
    return _(deps).map(function(d) {
      return resolve(d)
    })
  }
}

