var _ = require('lodash')
  , ast = require('../ast/adapter')

module.exports = {
  match     : match
, attach    : attach
}

function match(block) { 
  return ast.is.amd('require', block()[0]) && block().length === 1
}

function attach(mod, code) {
  var module = mod
    , body = code()
    , args = ast.get.expressionArgs(body[0])

  return {
    deps      : deps()
  , params    : params()
  , transform : transform 
  , variable  : true
  }

  function func() {
    if(args.length === 1) return args[0]
    if(args.length === 2) return args[1]
  }

  function deps () {
    var deps
    if(args.length === 2) deps = args[0].elements
    return _.map(deps, (function(e) { return e.value }))
  }

  function params() {
    return ast.is.func(func()) 
           ? _.map(func().params, function(e) { return e.name })
           : []
  }

  function transform() {
    var f = func()
      , create = ast.create
      , args = _.map(module.deps, function(d) { return create.id(d) })
    
    f.params = _.map(module.params, function(d) { return create.id(d) })

    return ast.generate(create.expressionStatement(create.callExpression(args, f)))
  }
}

