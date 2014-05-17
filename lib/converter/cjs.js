var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , estraverse = require('estraverse')
  , template = require('handlebars').compile

module.exports = {
    match     : match
  , attach    : attach
}

function match(block) { 
  var amd = _.partial(ast.is.amd, _, block[0])
  return block.length > 1 && !amd('define') && !amd('require')
}

function attach(mod, code) {
  var module = mod
    , params = []
    , deps = []
    , exp = []
    , toReplace = []
    , oldBody = code
    , body = estraverse.replace(ast.create.program(code), {enter: replace, leave: leave})

  _.each(toReplace, function(d,i) { body.body[d.idx] = d.content })

  return { 
      type      : 'cjs'
    , variable  : true
    , deps      : deps
    , params    : params
    , transform : transform
    }
  

  function replace(node, parent) {
    if (isRequireCall(node)) {
      deps.push(node.arguments[0].value)

      var param = 'r_' + _.now()
      params.push(param)
      return ast.create.id(param)
    }

    if(hasExports(node)) {
      exp.push(parent)
    }
  }

  function leave(node, parent) {
    if(exp.indexOf(node) > -1)
      toReplace.push({idx: oldBody.indexOf(parent), content: ast.create.ret(node.right)})
  }

  function transform() {
    var tmpl = template("(function({{params}}) { {{{code}}} })({{deps}})")
      , code = ast.generate(body)

    if(params.indexOf('exports') > -1) module.deps.push('exports')

    if(module.deps.length > 0)
      return tmpl({name: module.name
                  , params: module.params
                  , code: code
                  , deps: module.deps})

    return code
  }
}

function isRequireCall(node) {
  return node 
         && node.type === 'CallExpression'
         && node.callee
         && node.callee.type === 'Identifier'
         && node.callee.name === 'require'
         && node.arguments
         && node.arguments.length === 1
         && node.arguments[0].type === 'Literal'
}

function hasExports(node) {
  return node
         &&  node.type === 'MemberExpression'
         &&  node.object
         &&  node.object.name === 'module'
         &&  node.property
         &&  node.property.name === 'exports'
}