var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , convert: convert
  , deps: resolveDeps
  , name: resolveName
  , params: resolveParams
}

function match(body) { return ast.is.amd('require', body) }

function resolveName(body) { return "m_" + _.now() }

function resolveParams(body) {
  var expression = ast.get.expressionArgs(body)
    , deps = resolveDeps(body)
    , callee = expression[1]
    , params = {}

  _(callee.params).each(function(p, i){ params[deps[ i ]] = p.name })

  return params
}

function convert(body) {
  var expression = ast.get.expressionArgs(body)
    , params = expression[0].elements
    , callee  = expression[1]
    , args = _(params).map(function(d) { return ast.create.id(d.value) })


  return ast.create.expressionStatement(args, callee)
}

function resolveDeps (body) {
  var expression = ast.get.expressionArgs(body)
  return _(expression[0].elements).map(function(e) { return e.value })
}
