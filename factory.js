//TODO make fluent api
var matcher = require('./matcher')
  , _ = require('underscore')

function introduceVar(body) {
  //TODO make camelCase
  var name = body.arguments[0].value
    , deps = body.arguments[1].elements
    , fun  = body.arguments[2]

  return createProgram(createVar(escapeNestedDeps(name), deps, fun))
}

function introduceClosure(body) {
  var deps = body.arguments[0]
    , fun  = body.arguments[1]

  return createProgram(createClosure(deps, fun))
}

module.exports.introduceVar = introduceVar
module.exports.introduceClosure = introduceClosure

function createProgram(body) {
  return {
    "type": "Program",
    "body": [body] 
  }
}

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

function createClosure(arguments, functionExpression) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": functionExpression,
      "arguments": overrideDeps(arguments.elements)
    }
  }
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
