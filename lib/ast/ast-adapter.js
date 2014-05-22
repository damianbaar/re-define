var esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , matcher = require('./matcher')

module.exports = {
  create: {
    id: id
  , literal: literal
  , program: program
  , ret: ret 
  , expressionStatement: expressionStatement
  , callExpression: callExpression
  , iife: iife
  }
, is: matcher.is
, get: {
  expressionArgs: getCallExpressionArguments
}
, parse: function(contents, skipProgram) {
    var ast = esprima.parse(contents)
    return skipProgram ? ast.body : ast
  }
, generate: function(ast, config) {
    return escodegen.generate(ast, config)
  }
, replace: function(contents, cb) {
    return estraverse.replace(contents, cb)
  }
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

function iife(deps, functionExpression) {
  return {
    "type": "CallExpression",
    "callee": functionExpression,
    "arguments": deps
  }
}
