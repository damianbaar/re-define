var matcher = require('./matcher')
  , path = require('path')
  , _ = require('underscore')
  , config

//FIXME define(function(require){}) 
function introduceVar(body, configuration, filePath) {
  config = configuration

  var name = body.arguments[0].value
    , deps = body.arguments[1].elements
    , fun  = body.arguments[2] || body.arguments[1]
    , filteredDeps = []
    , params = []

  _(deps).each(function(d) { normalizePath(d, filePath) })
  _(deps).each(function(v){ if(shouldInclude(v)) filteredDeps.push(v) })
  _(fun.params).each(function(v){ if(shouldInclude(v)) params.push(v)})
  
  fun.params = params

  return createVar(escapeNestedDeps(name), filteredDeps, fun, config)

  function normalizePath(d, filePath) {
    if(d.value.indexOf("!")>-1) {
      var pluginPath = d.value.replace(/^(\w*[\///]?)*!/, "")
        , pluginName = d.value.replace(pluginPath, "")

      d.value = escapeNestedDeps(pluginName + normalize(pluginPath, filePath))
      return
    }

    if(d.value.indexOf("/") === -1) return

    if(_(config.paths).keys().indexOf(d.value) > -1) {
      d.orgValue = d.value
      d.value = escapeNestedDeps(d.value)

      return
    }

    d.value = normalize(d.value, filePath)
  }

  function normalize(value, filePath) {
    return path
            .normalize(filePath.replace(/[^\/]*$/,'') + value)
            .replace(path.resolve(config.baseUrl),"")
            .replace("\\","")
            .replace("\/","")
  }

  function shouldInclude(v) {
    var skip = false

    _(config.removeDeps).each(function(p){
      if(!skip) skip = new RegExp("^"+p+"$").test(v.name || v.value)
    })

    return !skip
  }
}

function introduceClosure(body) {
  var deps = body.arguments[0]
    , fun  = body.arguments[1]

  return createClosure(overrideDeps(deps.elements), fun)
}

function wrap(body, globals) {
  return createGlobalWrapper(body, globals)
}

module.exports.introduceVar = introduceVar
module.exports.introduceClosure = introduceClosure
module.exports.wrap = wrap

function createVar(name, deps, expression, config) {
  //TODO limitation: is able only to attach to one global
  var relation
  
  _(config.attachToGlobal).each(function(d){
    if(name == escapeNestedDeps(d.lib))
      relation = d
  })

  var shouldAttach = !!relation
    , right = convertExpression(expression, deps)
    , init = shouldAttach
             ? assignmentGlobalExpression(relation.global, name, right)
             : right

  return createVarDeclarator(escapeNestedDeps(name), init)

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

function createGlobalWrapper(body, config) {
  var params = []
    , escapedParams = []
    , globals = []

  if(!!config["amd-module-name"]) 
    body = body.concat(createAMDModule(config["amd-module-name"], config.name))

  _(config.injectGlobals).each(function(d){
    params.push(createIdentifier(escapeNestedDeps(d)))
    escapedParams.push(createIdentifier(d === "this" ? "parent" : escapeNestedDeps(d)))
  })

  _(config.customGlobals).each(function(d){
    params.push(createIdentifier(escapeNestedDeps(d)))
    escapedParams.push(createIdentifier(d))
  })

  _(config.initializeGlobals).each(function(d){
    globals.push(createSafeVarDeclaration(d))
  })

  return createProgram(
            globals, 
            createClosure(
              params, 
              createFunctionExpression(escapedParams, body)))
}

function overrideDeps(deps) {
  var shim = config.shim

  return _(deps).map(function(d) {
    var idx = -1
      , name = d.value

    if((idx = _(shim).keys().indexOf(d.orgValue)) > -1) {
      name = escapeNestedDeps(_(shim).values()[idx].exports)
    }

    return createIdentifier(escapeNestedDeps(name)) 
  })
}

function escapeNestedDeps(name) {
  if(name.indexOf("!") > -1) {
     name = escapePlugins(name)
  }

  return name.replace(/\-/g,"_")
             .replace(/\\/g,"")
             .replace(/\//g,"")
             .replace(/\./g,"")
}

function escapePlugins(name) {
  return "_" + name.toLowerCase()
                   .replace("!","")
}
/////////////////////////////
/////////// AST ////////////
///////////////////////////

//TODO make something with that and move to other module
function createProgram(vars, body) {
  return {"type": "Program", "body": vars.concat(body)}
}

function createFunctionExpression(params, body) {
  return {
    "type": "FunctionExpression",
    "defaults": [],
    "params": params,
    "body": createBlockStatement(body)
  }
}

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

function assignmentGlobalExpression(left, name, right) {
  return {
    "type": "AssignmentExpression",
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "computed": false,
      "object": createIdentifier(left),
      "property": createIdentifier(name)
    },
    "right": right
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

function createBlockStatement(body) {
  return {"type": "BlockStatement", "body": body}
}

function createAMDModule(name, lib) {
  return {
    "type": "IfStatement",
    "test": {
      "type": "LogicalExpression",
      "operator": "&&",
      "left": {
        "type": "BinaryExpression",
        "operator": "===",
        "left": {
          "type": "UnaryExpression",
          "operator": "typeof",
          "argument": createIdentifier("define"),
          "prefix": true
        },
        "right": {
          "type": "Literal",
          "value": "function",
          "raw": "'function'"
        }
      },
      "right": {
        "type": "MemberExpression",
        "computed": false,
        "object": createIdentifier("define"),
        "property": createIdentifier("amd")
      }
    },
    "consequent": createBlockStatement(
        [{
        "type": "ExpressionStatement",
        "expression": {
          "type": "CallExpression",
          "callee": {
            "type": "Identifier",
            "name": "define"
          },
          "arguments": [
            {
              "type": "Literal",
              "value": name,
              "raw": name
          },
          createIdentifier(escapeNestedDeps(lib))
          ]
        }
    }
    ])
    ,
    "alternate": null
  }
}
