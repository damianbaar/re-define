var esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')

module.exports = {
  create: {
    id: id
  , expressionStatement: expressionStatement
  , iife: iife
  }
, parse: function(contents, skipProgram) {
    var ast = esprima.parse(contents)
    return skipProgram ? ast.body : ast
  }
, generate: function(ast, config) {
    return escodegen.generate(ast, config)
  }
, replace: function(contents, cb) {
    return estraverse.replace(esprima.parse(contents), cb)
  }
}

function expressionStatement(args, callee) {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: callee,
      arguments: args
    }
  }
}

function id(name) {
  return {
    type:"Identifier",
    name: name
  }
}

function iife(deps, functionExpression) {
  return {
    "type": "CallExpression",
    "callee": functionExpression,
    "arguments": deps
  }
}
/////////////////////////
/////////////////////////
/////////////////////////
/////////////////////////

function createSafeVarDeclaration(name) {
  return createVarDeclarator(
          name,
          createLogicalExpression(
            id(name),
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