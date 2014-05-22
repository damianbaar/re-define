var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
    match     : match
  , attach    : attach
}

function match(block) {
  return ast.is.amd('define', block[0]) && block.length === 1
}

function attach(mod, code) {
  var module = mod
    , body = code

 return {
    name      : name()
  , deps      : deps()
  , params    : params()
  , transform : transform
  , variable  : true
  , type      : 'amd-define'
  }

  function name() {
    var args = ast.get.expressionArgs(body[0])
    if(args.length === 3) return args[0].value
  }

  function deps() {
    var args = ast.get.expressionArgs(body[0])
      , deps

    if(args.length === 3) deps = args[1].elements
    else if(args.length === 2) deps = args[0].elements

    return _(deps).map(function(e) { return e.value })
  }

  function func() {
    var args = ast.get.expressionArgs(body[0])

    if(args.length === 1) return args[0]
    if(args.length === 2) return args[1]
    if(args.length === 3) return args[2]
  }

  function params() {
    return ast.is.func(func(body)) 
           ? _.map(func(body).params, function(e) { return e.name })
           : []
  }

  function transform() {
    var args = module.deps
      , params = module.params

    return ast.generate(convertExpression(func(), args))

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
}

