module.exports.isDefine = isDefine
module.exports.isRequire = isRequire
module.exports.isCommonJS = isCommonJS

module.exports.isReturn = isReturn
module.exports.isProgram = isProgram

function isDefine(node) {
  if(!isProgram(node)) return false
  if(!isAMD(node)) return false

  var call = getCallExpression(node)
    , callee = call.callee 

  return callee.name == "define" ? call : null
}

function isRequire(node) {
  if(!isProgram(node)) return false
  if(!isAMD(node)) return false

  var call = getCallExpression(node)
    , callee = call.callee 
  
  return callee.name == "require" ? call : null
}

function isCommonJS(node) {
  if(!isProgram(node)) return false

  return node.body.length > 1 ? node.body : null
}

function isAMD(node) {
  var body = node.body

  return body.length == 1 && body[0].type == "ExpressionStatement"
}

function isProgram(node) { return node.type == "Program" }

function isReturn(node) { return node.type == "ReturnStatement" }


//////////////////////////////////////////////////
//////////////////////////////////////////////////
function getCallExpression(program) {
  var expression = program.body[0].expression 

  return (expression && expression.type == 'CallExpression') 
         ? expression 
         : {}
} 
