var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , func: func
  , deps: resolveDeps
  , name: resolveName
  , params: resolveParams
}

function match(body) { return ast.is.amd('require', body) }

function resolveName() { return "m_" + _.now() }

function resolveParams(body) {
  var expression = ast.get.expressionArgs(body)
    , deps = resolveDeps(body)
    , callee = expression[1]

  return _(callee.params).map(function(p, i){ return { name: p.name, ref: deps[ i ]}})
}

function func(body) {
  var expression = ast.get.expressionArgs(body)
    , callee  = expression[1]

  return callee
}

function resolveDeps (body) {
  var expression = ast.get.expressionArgs(body)

  return _(expression[0].elements).map(function(e) { return e.value })
}
