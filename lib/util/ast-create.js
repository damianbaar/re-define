module.exports = {
    id: id
  , literal: literal
  , program: program
  , ret: ret 
  , var: assignToVar
  , require: createRequire
  , callExpression: callExpression
  }

function program(body) {
  return {
    "type": "Program",
    "body": body
  }
}

function id(name) {
  return {
    type:"Identifier",
    name: name
  }
}

function ret(argument) {
  return {
    "type": "ReturnStatement",
    "argument": argument
  }
}

function literal(name) {
  return {
    type:"Literal",
    value: name,
    raw: name
  }
}

function assignToVar(name, init) {
  return { "type": "VariableDeclaration",
            "declarations": [
              { "type": "VariableDeclarator",
                "id": { "type": "Identifier", "name": name },
                "init": init 
              }
            ],
            "kind": "var"
          }
}

function createRequire(dep) {
  return { "type": "CallExpression",
           "callee": { "type": "Identifier", "name": "require" },
           "arguments": [ { "type": "Literal", "value": dep, "raw": dep } ]
         }
}

function expressionStatement(expression) {
  return { type: "ExpressionStatement", expression: expression }
}

function callExpression(args, callee) {
  return { type: "CallExpression", callee: callee, arguments: args }
}
