var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , func: func
  , deps: deps
  , name: name
}

function match(body) { return ast.is.amd('require', body[0]) }

function name() { return "m_" + _.now() }

function func(body) {
  var expression = ast.get.expressionArgs(body[0])
    , callee  = expression[1]

  return callee
}

function deps (body) {
  var expression = ast.get.expressionArgs(body[0])

  return _(expression[0].elements).map(function(e) { return e.value })
}
