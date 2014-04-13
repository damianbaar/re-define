var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , normalize: normalize
  , convert: convert
}

function normalize(name, content) {
  ast.get
     .expressionArgs(content)
     .unshift(ast.create.literal(name))

  return content
}

function match(content) {
  return ast.is.amd('define', content)
}

function convert(expressionStatement, config) {
  var expression = ast.get.expressionArgs(expressionStatement)
    , name =  expression[0].value
    , deps =  expression[1].elements
    , fun  =  expression[2] || expression[1]
    , variable
    , shim

  // _(deps).each(function(d){
  //   d.value = (config.is.complexName(d.value) && !config.rename[d.value])
  //             || config.is.plugin(d.value)
  //              ? config.normalize.path(d.value, filePath)
  //              : d.value })

  // if(config.is.plugin(name))
  //   name = config.normalize.plugin(name)

  shim = config.shim(name)

  variable = config.is.complexName(shim)
             ? shim
             : "var " + shim

  if(config.should.registerGlobal(name)) {
    variable += "=" + config.export[name].global
    variable += config.escape(name)
  }

  variable += " = " + ast.generate(convertExpression(fun, deps))

  return { ast: ast.parse(variable)
         , name: name
         , deps: _(deps).map(function(v) { return v.value})
         }

  function convertExpression(block, deps) {
    if(ast.is.object(block))
      return block

    if(ast.is.independentExpression(block) && deps.length === 0)
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
      return ast.create.id(config.shim(d.value))
    })
  }
}