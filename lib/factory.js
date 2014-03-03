var matcher = require('./matcher')
  , _ = require('underscore')

//FIXME define(function(require){}) 
function introduceVar(body, config) {
  var name = body.arguments[0].value
    , deps = body.arguments[1].elements
    , fun  = body.arguments[2] || body.arguments[1]

  return createVar(escapeNestedDeps(name), deps, fun, config)
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
  var relation = _(config.attachToGlobal).where({lib:name})[0]
    , shouldAttach = !!relation
    , right = convertExpression(expression, deps)
    , init = shouldAttach
             ? assignmentGlobalExpression(relation.global, name, right)
             : right

  return createVarDeclarator(name, init)

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
  var orgParams = []
    , escapedParams = []
    , initializeGlobals = []

  _(config.injectGlobals).each(function(d){
    orgParams.push(createIdentifier(d))
    escapedParams.push(createIdentifier(d === "this" ? "parent" : d))
  })

  _(config.customGlobals).each(function(d){
    orgParams.push(createIdentifier(d))
    escapedParams.push(createIdentifier(d))
  })

  _(config.initializeGlobals).each(function(d){
    initializeGlobals.push(createSafeVarDeclaration(d))
  })

  return createProgram(
            initializeGlobals, 
            createClosure(
              orgParams, 
              createFunctionExpression(escapedParams, body)))
}


/////////////////////////////
/////////// AST ////////////
///////////////////////////
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

function overrideDeps(deps) {
  return _(deps).map(function(d) {
    return createIdentifier(escapeNestedDeps(d.value)) 
  })
}

function escapeNestedDeps(name) {
  return name.replace(/(?:\.*\/)*(.*)/g,"$1")
             .replace(/\-/g,"_")
             .replace(/[\/]([a-z])/g, function(v) {
               return v.toUpperCase().replace("/","")
             })
}
