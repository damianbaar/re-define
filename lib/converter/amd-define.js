var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
    match  : match
  , type   : 'amd-define'
  , variable: true
  , func   : func
  , deps   : deps
  , params : params
  , name   : name
  , transform : transform
}

function match(body) {
  return ast.is.amd('define', body[0]) && body.length === 1
}

function name(body) {
  var args = ast.get.expressionArgs(body[0])

  if(args.length === 3) return args[0].value

  return
}

function deps(body) {
  var args = ast.get.expressionArgs(body[0])
    , deps

  if(args.length === 3) deps = args[1].elements
  else if(args.length === 2) deps = args[0].elements

  return _(deps).map(function(e) { return e.value })
}

function func(body) {
  var args = ast.get.expressionArgs(body[0])

  if(args.length === 1) return args[0]
  if(args.length === 2) return args[1]
  if(args.length === 3) return args[2]
}

function params(body) {
  return ast.is.func(func(body)) 
         ? _.map(func(body).params, function(e) { return e.name })
         : []
}

function transform(module) {
  var args = module.deps
    , fun = module.ast
    , params = module.params

  return convertExpression(fun, args)

  function convertExpression(block, deps) {
    if(ast.is.object(block))
      return block

    if(ast.is.independentExpression(block) && deps && deps.length === 0)
      return resolveInlineDeps(block)

    block.params = _(module.params).map(function(d) { return ast.create.id(d) })

    return ast.create.iife(resolveArgs(deps), block)

    function resolveInlineDeps(block) {
      return block.body.body[0].argument
    }

    function resolveArgs(deps) {
      return _(deps).map(function(d) {
        return ast.create.id(d)
      })
    }
  }
}
