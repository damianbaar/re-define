//TODO make fluent api
var matcher = require('./matcher')

module.exports.createProgram = createProgram
module.exports.createVar = createVar

function createProgram(body) {
  return {
    "type": "Program",
    "body": [body] //TODO add check
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

function createSelfInvokingFunction(functionExpression) {
  return {
    "type": "CallExpression",
    "callee": functionExpression,
    "arguments": functionExpression.params
  }
}

function convertExpression(block) {
  if(matcher.isReturn(block))
    return block.argument
  else{
    return createSelfInvokingFunction(block) 
  }
}

