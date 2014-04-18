var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , convert: convert
  , deps: deps
}

function match(body) {
  return ast.is.amd('require', body[0])
}

function convert(body, module) {
  module.ast = redefine(body[0])
  module.deps = deps(body[0])
}

function deps (body) {
  var expression = ast.get.expressionArgs(body)
  return _(expression[0].elements).map(function(e) { return e.value })
}

function redefine(body) {
  var expression = ast.get.expressionArgs(body)
    , params = expression[0].elements
    , callee  = expression[1]
    , args = _(params).map(function(d) { return ast.create.id(d.value) })

  return ast.create.expressionStatement(args, callee)
}

