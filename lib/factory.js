var matcher = require('./matcher')
  , path = require('path')
  , esprima = require('esprima')
  , escodegen = require('escodegen').generate
  , _ = require('underscore')
  , nl = require("./utils").newLine
  , config
  , verbose

//FIXME define(function(require){})
function introduceVar(body, configuration, filePath) {
  config = configuration

  var name = body.arguments[0].value
    , deps = body.arguments[1].elements
    , fun  = body.arguments[2] || body.arguments[1]
    , variable
    , shim

  _(deps).each(function(d){
    d.value = (isComplexPath(d.value) && !config.resolve[d.value])
              || isPlugin(d.value)
               ? normalizePath(d.value, filePath)
               : d.value })

  if(isPlugin(name)) name = normalizePluginName(name)

  shim = applyShim(name)

  variable = isComplexPath(shim)
             ? shim
             : "var " + shim

  if(toGlobal(name)) {
    variable += "=" + config.export[name].global
    variable += !isComplexPath(name) ? "." + name : squareBrackets(name)
  }

  variable += " = " + escodegen(convertExpression(fun, deps))

  return esprima.parse(variable).body[0]

  function convertExpression(block, deps) {
    if(matcher.isObjectExpression(block)) return block

      var body = block.body.body
        , len = body.length

      return len == 1 && matcher.isReturn(body[0]) && deps.length == 0
        ? resolveInlineDeps(body)
        : createVarSelfInvokingFunction(deps, block)

        function resolveInlineDeps(body) {
          return body[0].argument
        }
  }
}

function introduceClosure(body) {
  var deps = body.arguments[0]
    , fun  = body.arguments[1]

  return createClosure(overrideDeps(deps.elements), fun)
}

function wrap(body, config) {
  var wrapper = "(function (params) { var scope = {} }(args))"
    , params = []
    , args = []
    , init = []
    , globals = config.globals

  _(globals).each(function(d) {
    args.push(!!d.global
              ? d.global + squareBrackets(d.lib)
              : d.lib != "this" ? applyShim(d.lib) : d.lib)

    params.push(!!d.as ? d.as : d.lib)
  })

  wrapper = wrapper.replace("params", params.join(","))
                   .replace("args", args.join(","))

  wrapper = esprima.parse(wrapper)

  var wrapperBody = wrapper.body[0].expression.callee.body
    , block = wrapperBody.body

  _(globals).each(function(d) {
    if(d.init) {
      var variable = d.global || d.lib

      variable = "var " + variable + "=" + variable + "|| {}"
      init.push(esprima.parse(variable).body[0])
    }
  })
  block = block.concat(body)

  for(var lib in config.export) {
    if(!isAMD(lib)) continue

    var define = "if (typeof define === 'function' && define.amd)"
                 + "define('module-name', module-ref)"

    define = define.replace("module-name", config.export[lib].amd)
                   .replace("module-ref", applyShim(lib))

    define = esprima.parse(define).body[0]

    block.push(define)
  }

  wrapper.body = init.concat(wrapper.body)

  verbose && console.log(nl(), "Wrapper:", nl(), escodegen(wrapper), nl())

  wrapperBody.body = block

  return  wrapper
}

function applyShim(lib) {
  var ref

  if(!!config.resolve[lib])
    ref = config.resolve[lib].as

  ref = ref || lib
  return escapeLib(ref)
}

function isAMD(lib) {
  return config.export[lib] && !!config.export[lib].amd
}

function toGlobal(lib) {
  return !!config.export[lib] && !!config.export[lib].global
}

function escapeLib(lib) {
  return isComplexPath(lib) ? createScopeKey(lib) : lib
}

function squareBrackets(lib) {
  return "['" + lib + "']"
}

function isComplexPath(lib) { return /[\/|\\|\.]/.test(lib) }

function isPlugin(lib) { return lib.indexOf("!") > -1 }

function createScopeKey(lib) { return "scope['"+ lib +"']" }

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
            .replace("\\","")
            .replace("\/","")
  }
}

function normalizePluginName(name) {
  return name.replace(/^(\w*[\///]?)*!/, "")
}

module.exports.introduceVar = introduceVar
module.exports.introduceClosure = introduceClosure
module.exports.wrap = wrap
module.exports.verbose = function(value) { verbose = value }

function overrideDeps(deps) {
  return _(deps).map(function(d) {
    return createIdentifier(applyShim(d.value))
  })
}
/////////////////////////////
/////////// AST ////////////
///////////////////////////

function createVarSelfInvokingFunction(deps, functionExpression) {
  return {
    "type": "CallExpression",
    "callee": functionExpression,
    "arguments": overrideDeps(deps)
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


