var matcher = require('../matcher')
  , ast = require('../ast-adapter')
  , _ = require('underscore')

module.exports = {
  match: match
  , convert: convert
}

function match(content) {
  return matcher.isAMDExpression('define', content)
}

function convert(callExpression, config) {
  var expression = callExpression.expression.arguments
    , name =  expression[0].value
    , deps =  expression[1].elements
    , fun  =  expression[2] || expression[1]
    , variable
    , shim

  _(deps).each(function(d){
    d.value = (config.is.complexPath(d.value) && !config.resolve[d.value])
              || config.is.plugin(d.value)
               ? normalizePath(d.value, filePath)
               : d.value })

  if(config.is.plugin(name))
    name = config.normalizePluginName(name)

  shim = config.shim(name)

  variable = config.is.complexPath(shim)
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
    if(matcher.isObjectExpression(block)) return block

      var body = block.body.body
        , len = body.length

      return len === 1 && matcher.isReturn(body[0]) && deps.length === 0
        ? resolveInlineDeps(body)
        : ast.create.iife(resolveElements(deps), block)

        function resolveInlineDeps(body) {
          return body[0].argument
        }
  }

  function resolveElements(deps) {
    return _(deps).map(function(d) {
      return ast.create.id(config.shim(d.value))
    })
  }
}