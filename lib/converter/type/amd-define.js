var _ = require('lodash')
  , ast = require('../ast/adapter')

module.exports = {
    match     : match
  , attach    : attach
}

function match(block) {
  return ast.is.amd('define', block()[0]) && block().length === 1
}

function attach(mod, code) {
  var module = mod
    , body = code()
    , args = ast.get.expressionArgs(body[0])

 return {
    name      : name()
  , deps      : deps()
  , params    : params()
  , transform : transform
  , variable  : true
  }

  function name() {
    if(args.length === 3) return args[0].value
  }

  function deps() {
    var deps

    if(args.length === 3) deps = args[1].elements
    else if(args.length === 2) deps = args[0].elements

    return _.map(deps, function(e) { return e.value })
  }

  function func() {
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
    var args = module.deps || deps
      , params = module.params || params

    return ast.generate(convertExpression(func(), args))

    function convertExpression(block, deps) {
      if(ast.is.object(block))
        return block

      if(ast.is.independentExpression(block) && deps && deps.length === 0)
        return resolveInlineDeps(block)

      block.params = _.map(module.params, function(d) { return ast.create.id(d) })

      return ast.create.iife(resolveArgs(deps), block)

      function resolveInlineDeps(block) {
        return block.body.body[0].argument
      }

      function resolveArgs(deps) {
        return _.map(deps, function(d) {
          return ast.create.id(d)
        })
      }
    }
  }
}

