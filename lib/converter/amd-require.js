var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , counter = require('../utils/counter')()

module.exports = {
  match     : match
, attach    : attach
}

function match(block) { 
  return ast.is.amd('require', block[0]) && block.length === 1
}

function attach(mod, code) {
  var module = mod
    , body = code

  return {
    name      : name()
  , deps      : deps()
  , params    : params()
  , transform : transform 
  , type      : 'amd-require'
  , variable  : true
  }

  function name() { return "m_" + counter.next() }

  function func() {
    var expression = ast.get.expressionArgs(body[0])
      , callee  = expression[1]

    return callee
  }

  function deps () {
    var expression = ast.get.expressionArgs(body[0])

    return _(expression[0].elements).map(function(e) { return e.value })
  }

  function params() {
    return ast.is.func(func()) 
           ? _.map(func().params, function(e) { return e.name })
           : []
  }

  function transform() {
    var deps = module.deps
      , f = func()
      , args = _(module.deps).map(function(d) { return ast.create.id(d) })
    
    f.params = _(module.params).map(function(d) { return ast.create.id(d) })

    return ast.generate(ast.create.expressionStatement(args, f))
  }
}

