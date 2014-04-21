var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , func: resolveFunction
  , deps: resolveDeps
  , name: resolveName
  , params: resolveParams
}

function match(body) {
  return ast.is.amd('define', body)
}

function resolveName(body) {
  if(!_(body).isArray())
    body = ast.get.expressionArgs(body)

  if(body.length === 3)
    return body[0].value

  return
}

function resolveParams(body) {
  if(!_(body).isArray()) body = ast.get.expressionArgs(body)

  var deps = resolveDeps(body)
    , fun = resolveFunction(body)

  return _(fun.params).each(function(p, i){ return {name: p.name, ref: deps[ i ] }})
}

function resolveDeps(body) {
  var deps

  if(!_(body).isArray()) body = ast.get.expressionArgs(body)

  if(body.length === 3) deps = body[1].elements
  else if(body.length === 2) deps = body[0].elements

  return _(deps).map(function(e) { return e.value })
}

function resolveFunction(body) {
  if(!_(body).isArray()) body = ast.get.expressionArgs(body)

  if(body.length === 1) return body[0]
  if(body.length === 2) return body[1]
  if(body.length === 3) return body[2]
}
