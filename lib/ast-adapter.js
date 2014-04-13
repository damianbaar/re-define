var esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , matcher = require('./matcher')

module.exports = {
  create: {
    id: id
  , expressionStatement: expressionStatement
  , iife: iife
  , noConflictVar: noConflictVar
  }
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
    return estraverse.replace(esprima.parse(contents), cb)
  }
}

function getCallExpressionArguments(expressionStatement) {
  if( matcher.is.expressionStatement(expressionStatement)
      && matcher.is.callExpression(expressionStatement.expression))
    return expressionStatement.expression.arguments

  return
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

function noConflictVar(name) {
  return esprima.parse('var name = name || {}'.replace('name', name))
}
