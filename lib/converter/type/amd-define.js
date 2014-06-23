var _ = require('lodash')
  , ast = require('../ast/adapter')

module.exports = {
    match     : match
  , attach    : attach
}

function match(block) {
  return ast.is.amd('define', block()[0]) && block().length === 1
}

function attach(mod, code, config) {
  var module = mod
    , body = code()
    , args = ast.get.expressionArgs(body[0])

  return { name      : name()
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
    var f

    if(args.length === 1) f = args[0]
    if(args.length === 2) f = args[1]
    if(args.length === 3) f = args[2]

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

  function params() {
    return ast.is.func(func(body)) 
           ? _.map(func(body).params, function(e) { return e.name })
           : []
  }

  function transform() {
    module.deps = module.deps || deps
    module.params = module.params || params

    return ast.generate(convertExpression(func(), module.deps))

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

