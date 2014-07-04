var estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , matcher = require('./matcher')
  , acorn = require('acorn')
  , walk = require('acorn/util/walk')

module.exports = {
  create: {
    id: id
  , literal: literal
  , program: program
  , ret: ret 
  , var: assignToVar
  , require: createRequire
  , expressionStatement: expressionStatement
  , callExpression: callExpression
  }
, is: matcher.is
, get: {
  expressionArgs: getCallExpressionArguments
}
, parse: function(contents) { return acorn.parse(contents) }
, generate: function(ast, config) { return escodegen.generate(ast, config) }
, walk: function(ast, visitors) { return walk.simple(ast, visitors) }
, replace: replace
}

function replace(contents, cb) {
  return estraverse.replace(contents, cb)
}

function getCallExpressionArguments(expressionStatement) {
  if( matcher.is.expressionStatement(expressionStatement)
      && matcher.is.callExpression(expressionStatement.expression))
    return expressionStatement.expression.arguments

  return
}

function expressionStatement(expression) {
  return {
    type: "ExpressionStatement",
    expression: expression
  }
}

function callExpression(args, callee) {
  return {
    type: "CallExpression",
    callee: callee,
    arguments: args
  }
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
