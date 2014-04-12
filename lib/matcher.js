function isAMDExpression(type, node) {
  return node.type === "ExpressionStatement"
         && node.expression.type === "CallExpression"
         && node.expression.callee.name === type
}

function isProgram(program) { return program.type === "Program" }

function isReturn(node) { return node.type === "ReturnStatement" }

function isObjectExpression(node) {return node.type === "ObjectExpression"}

module.exports.isReturn = isReturn
module.exports.isProgram = isProgram
module.exports.isAMDExpression = isAMDExpression
module.exports.isObjectExpression = isObjectExpression
