var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , convert: convert
}

function match(body) {
  return ast.is.amd('define', body)
}

function convert(body, module) {
  module.deps = deps(body)
  module.ast = redefine(module.name, body)
}

function deps (body) {
  var expression = ast.get.expressionArgs(body)
  return _(expression[0].elements).map(function(e) { return e.value })
}

function redefine(name, expressionStatement) {
  var expression = ast.get.expressionArgs(expressionStatement)
    , deps =  expression[0].elements
    , fun  =  expression[1] || expression[0]

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