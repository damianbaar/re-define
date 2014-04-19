var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , convert: convert
  , deps: deps
}

function match(body) {
  return ast.is.amd('define', body)
}

function convert(body, module) {
  console.log('converting', module.name)

  module.ast = redefine(module, body)
  return module
}

function deps (body, module) {
  var expression = ast.get.expressionArgs(body)
  module.deps = _(expression[0].elements).map(function(e) { return e.value })
  console.log(module.deps)
  return module
}

function redefine(module, expressionStatement) {
  var expression = ast.get.expressionArgs(expressionStatement)
    , name = module.name
    , deps
    , fun

  if(expression.length === 3) {
    name = expression[0].value
    deps = expression[0].elements
    fun  = expression[1] || expression[0]
  } else if(expression.length === 2) {
    deps = expression[0].elements
    fun  = expression[1] || expression[0]
  } else if(expression.length === 1) {
    fun = expression[0]
  }

  // _(fun.params).each(function(p, i){
  //   console.log('aliases', p.name, deps[i].value, module.map,
  //     module.map[deps[i]] ? module.map[p.name].value : 'none')
  // })

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