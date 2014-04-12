var matcher = require('../matcher')
  , adapter = require('../ast-adapter')
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
    d.value = (isComplexPath(d.value) && !config.resolve[d.value])
              || isPlugin(d.value)
               ? normalizePath(d.value, filePath)
               : d.value })

  if(isPlugin(name)) name = normalizePluginName(name)

  shim = config.shim(name)

  variable = isComplexPath(shim)
             ? shim
             : "var " + shim

  if(config.global(name)) {
    variable += "=" + config.export[name].global
    variable += config.escape(name)
  }

  variable += " = " + adapter.generate(convertExpression(fun, deps))

  return { ast: adapter.parse(variable).body[0]
         , name: name
         , deps: _(deps).map(function(v) { return v.value})
         }

  function convertExpression(block, deps) {
    if(matcher.isObjectExpression(block)) return block

      var body = block.body.body
        , len = body.length

      return len === 1 && matcher.isReturn(body[0]) && deps.length === 0
        ? resolveInlineDeps(body)
        : createVarSelfInvokingFunction(deps, block)

        function resolveInlineDeps(body) {
          return body[0].argument
        }
  }


function isComplexPath(lib) { return /[\-\/|\\|\.]/.test(lib) }

function isPlugin(lib) { return lib.indexOf("!") > -1 }

function normalizePath(name, filePath) {

  if(!isComplexPath(name)) return name

  if(isPlugin(name))
    return normalize(normalizePluginName(name), filePath)

  return normalize(name, filePath)

normalizePath()
  function normalize(value, filePath) {
    return path
            .normalize(filePath.replace(/[^\/]*$/,'') + value)
            .replace(path.resolve(config.baseUrl),"")
            .replace(/\\/g,"/")
            .replace("\/","")
  }
}

function createVarSelfInvokingFunction(deps, functionExpression) {
  return {
    "type": "CallExpression",
    "callee": functionExpression,
    "arguments": overrideArguments(deps)
  }
}

function createClosure(args, functionExpression) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": functionExpression,
      "arguments": args
    }
  }
}

function createSafeVarDeclaration(name) {
  return createVarDeclarator(
          name,
          createLogicalExpression(
            createIdentifier(name),
            createEmptyObjectExpression(),
            "||")
         )
}

function createVarDeclarator(name, init) {
  return {
    "type": "VariableDeclaration",
    "declarations": [
      {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": name
      },
      "init": init || {}
    }
    ],
    "kind": "var"
  }
}

function createLogicalExpression(left, right, operator) {
  return {
    "type": "LogicalExpression",
    "operator": operator,
    "left": left,
    "right": right
  }
}

function createEmptyObjectExpression(){
  return { "type": "ObjectExpression", "properties": [] }
}

function createIdentifier(name) {
  return {type:"Identifier", name: name}
}


function overrideArguments(deps) {
  return _(deps).map(function(d) {
    // return createIdentifier(applyShim(d.value))
    return createIdentifier(d.value)
  })
}

}


function normalizePluginName(name) {
  return name.replace(/^(\w*[\///]?)*!/, "")
}
