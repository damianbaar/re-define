var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , convert: convert
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
    , params = {}

  _(fun.params).each(function(p, i){ params[deps[ i ]] = p.name })


  return params
}

function convert(body, moduleName) {
  var expression = ast.get.expressionArgs(body)
    , name = moduleName || resolveName(expression)
    , deps = resolveDeps(expression)
    , fun = resolveFunction(expression)


  // variable = config.is.complexName(name)
  //            ? config.normalize.module(name)
  //            : "var " + name

  // variable += " = " + ast.generate()

  return convertExpression(fun, deps)

  function convertExpression(block, deps) {
    if(ast.is.object(block))
      return block

    if(ast.is.independentExpression(block) && deps && deps.length === 0)
      return resolveInlineDeps(block)

    return ast.create.iife(resolveElements(deps), block)

    function resolveInlineDeps(body) {
      var body = block.body.body
        , len = body.length
      return body[0].argument
    }
  }

  function resolveElements(deps) {
    return _(deps).map(function(d) {
      return ast.create.id(d.value)
    })
  }
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
