function isAMDExpression(type, node) {
  return node.type === "ExpressionStatement"
         && node.expression.type === "CallExpression"
         && node.expression.callee.name === type
}

function expressionHasSimpleReturn(node) {
  var fun = node
    , block = fun.body
    , body = block.body

  //FuncionExpression.body->blockStatemnt->body->ReturnStatement
  //FuncionExpression.body->blockStatemnt->body->ReturnStatement

  return body.length === 1 && isReturn(body[0])
}

function isProgram(program) { return program.type === "Program" }
function isReturn(node) { return node.type === "ReturnStatement" }
function isObjectExpression(node) {return node.type === "ObjectExpression"}
function isFunctionExpression(node) {return node.type === "FunctionExpression"}
function isBlockStatement(node) {return node.type === "BlockStatement"}
function isExpressionStatement(node) {return node.type === "ExpressionStatement"}
function isCallExpression(node) {return node.type === "CallExpression"}

var is = {
  ret: isReturn
, program: isProgram
, amd: isAMDExpression
, object: isObjectExpression
, func: isFunctionExpression
, independentExpression: expressionHasSimpleReturn
, blockStatemnt: isBlockStatement
, callExpression: isCallExpression
, expressionStatement: isExpressionStatement
}

module.exports.is = is