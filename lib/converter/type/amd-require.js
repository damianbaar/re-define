var _ = require('lodash')
  , ast = require('../ast/adapter')

module.exports = {
  match     : match
, attach    : attach
}

function match(block) { 
  return ast.is.amd('require', block()[0]) && block().length === 1
}

function attach(mod, code, config) {
  var module = mod
    , body = code()
    , args = ast.get.expressionArgs(body[0])
    , c = 0 

  return {
    deps      : deps()
  , name      : name()
  , params    : params()
  , transform : transform 
  , variable  : true 
  }

  function name() { return !!mod.name ? mod.name : 'r_' + c++ }

  //TODO refactor this, duplicate from amd-define
  function func() {
    var f

    if(args.length === 1) f = args[0]
    if(args.length === 2) f = args[1]

    return ast.replace(f, {enter: replace})

    function replace(node, parent) {
      if (isRequireCall(node)) {
        var args = node.arguments

        if(args && args.length === 1 && !!args[0].value) {
          module.internal = (module.internal|| [])
          module.internal.push(args[0].value)
        }

        node.callee.name = config.requireFunc

        return node
      }
    }

    function isRequireCall(node) {
      return node 
             && node.type === 'CallExpression'
             && node.callee
             && node.callee.type === 'Identifier'
             && node.callee.name === 'require'
    }
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
    module.deps = _.map(module.deps, function(d) { return d.name })

    var f = func()
      , create = ast.create
      , args = _.map(module.deps, function(d) { return create.id(d) })
    
    f.params = _.map(module.params, function(d) { return create.id(d) })

    return ast.generate(create.expressionStatement(create.callExpression(args, f)))
  }
}

