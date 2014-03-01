module.exports.isDefine = isDefine
module.exports.resolveFunction = resolveFunction
module.exports.isReturn = isReturn

function isDefine(node) {
  if(!(node.type == "Program" 
     && node.body[0].type == "ExpressionStatement")) return

  var call = node.body[0].expression 
    , callee = call.callee

 if(!(call 
     && callee
     && call.type == 'CallExpression'
     && callee.type == 'Identifier'
     && callee.name == 'define')) return

  return call
}

function resolveFunction(fun){
  var body = fun.body.body
    , len = body.length

  return len == 1 && isReturn(body[0])
         ? body[0]
         : fun
}

function isReturn(node) {
  return node.type == "ReturnStatement"
}
