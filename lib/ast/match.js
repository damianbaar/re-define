module.exports = {
  ret: function(node) { return node.type === "ReturnStatement" }
, program: function(program) { return program.type === "Program" }
, object: function(node) {return node.type === "ObjectExpression"}
, func: function(node) {return node.type === "FunctionExpression"}
, blockStatemnt: function(node) {return node.type === "BlockStatement"}
, callExpression: function(node) {return node.type === "CallExpression"}
, expressionStatement: function(node) {return node.type === "ExpressionStatement"}
, amd: isAMDExpression
, independentExpression: expressionHasSimpleReturn
}


function isAMDExpression(type, node) {
  return node.type === "ExpressionStatement"
         && node.expression.type === "CallExpression"
         && node.expression.callee.name === type
}

function expressionHasSimpleReturn(node) {
  var fun = node
    , block = fun.body
    , body = block.body

  return body.length === 1 && is.ret(body[0])
}
