//TODO make fluent api
var matcher = require('./matcher')

module.exports.createProgram = createProgram
module.exports.createVar = createVar
module.exports.resolveFunction = resolveFunction


//TODO name at the end of sign
function createProgram(body, name) {
  var newBody = !!name 
    ? createVar(name, resolveFunction(body))
    : createSelfInvokingFunctionWithClousure(
      body.arguments[0]
    , resolveFunction(body.arguments[1]))

  return {
    "type": "Program",
    "body": [newBody] 
  }
}

function createVar(name, expression) {
  return {
    "type": "VariableDeclaration",
    "declarations": [
      {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": name
      },
      "init": convertExpression(expression)
    }
    ],
    "kind": "var"
  }
}

function createVarSelfInvokingFunction(functionExpression) {
  return {
    "type": "CallExpression",
    "callee": functionExpression,
    "arguments": functionExpression.params
  }
}

function createSelfInvokingFunctionWithClousure(arguments, functionExpression) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": functionExpression,
      "arguments": arguments.elements
    }
}
}

function resolveFunction(fun){
  var body = fun.body.body
    , len = body.length

  return len == 1 && matcher.isReturn(body[0])
         ? body[0]
         : fun
}

function convertExpression(block) {
  if(matcher.isReturn(block))
    return block.argument
  else{
    return createVarSelfInvokingFunction(block) 
  }
}

