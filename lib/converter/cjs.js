var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , estraverse = require('estraverse')
  , template = require('handlebars').compile

module.exports = {
  match: match
  , type: 'common-js'
  , variable: true
  , func: func
  , deps: deps
  , params: params
  , name: name
  , transform: transform
}

var _body
  , _deps

function match(body) { 
  var amd = _.partial(ast.is.amd, _, body[0])
  return body.length > 1 && !amd('define') && !amd('require')
}

function name() { return }

function func(body) { return _body }

function deps (body) {
  if(_deps) return _deps

  var d = []

  _body = estraverse.replace(ast.create.program(body)
  , { enter: function(node) {
      if (isRequireCall(node)) {
        d.push(node.arguments[0].value)
        return ast.create.id('r_1')
      }

      if(hasExports(node)) {
        d.push('aaaa___')
        return ast.create.id('____')
      }
    }}
  )

  return d
}

function params(body) { return _deps }

function transform(module) {
  var tmpl

  if(module.deps.length > 0) {
    tmpl = template("(function({{params}}) { {{{code}}} })({{deps}})")

    return tmpl({name: module.name
                , params: module.params
                , code: ast.generate(module.ast)
                , deps: module.deps})
  }

  return ast.generate(module.ast)
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
