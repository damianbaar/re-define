var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , type: 'amd-require'
  , func: func
  , deps: deps
  , params: params
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

function params(body) {
  return ast.is.func(func(body)) 
         ? _.map(func(body).params, function(e) { return e.name })
         : []
}
