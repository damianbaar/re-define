var matcher = require('./matcher')
  , _ = require('underscore')

function introduceVar(body) {
  var name = body.arguments[0].value
    , deps = body.arguments[1].elements
    , fun  = body.arguments[2]

  return createVar(escapeNestedDeps(name), deps, fun)
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

function createVar(name, deps, expression) {
  return {
    "type": "VariableDeclaration",
    "declarations": [
      {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": name
      },
      "init": convertExpression(expression, deps)
    }
    ],
    "kind": "var"
  }

  function convertExpression(block, deps) {
    var body = block.body.body
      , len = body.length

    return len == 1 && matcher.isReturn(body[0]) && deps.length == 0
           ? resolveInlineDeps(body)
           : createVarSelfInvokingFunction(deps, block)

      function resolveInlineDeps(body) { return body[0].argument }

      function createVarSelfInvokingFunction(deps, functionExpression) {

        return {
          "type": "CallExpression",
          "callee": functionExpression,
          "arguments": overrideDeps(deps)
        }
      }
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

function createGlobalWrapper(body, globals, ns) {
  var deps = _(globals).map(function(d){
                return {type:"Identifier", name: d}
              })

  return createProgram(
          createClosure(deps,
            {
              "type": "FunctionExpression",
              "defaults": [],
              "params": deps,
              "body": createBlockStatement(body)
            }))
}

function createProgram(body) {
  return { "type": "Program", "body": [body]}
}

function createBlockStatement(body) {
  return {"type": "BlockStatement", "body": body}
}

function escapeNestedDeps(name) {
  return name.replace(/^.\//,"")
             .replace(/[\/]([a-z])/g, function(v) {
               return v.toUpperCase().replace("/","")
             })

}

function overrideDeps(deps) {
  return _(deps).map(function(d) {
    d.name = escapeNestedDeps(d.value)
    d.type = "Identifier"

    return  d
  })
}
