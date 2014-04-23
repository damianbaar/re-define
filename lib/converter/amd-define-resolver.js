var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  match: match
  , func: func
  , deps: deps
  , name: name
}

function match(body) {
  return ast.is.amd('define', body[0])
}

function name(body) {
  var args = ast.get.expressionArgs(body[0])

  if(args.length === 3) return args[0].value

  return
}

function deps(body) {
  var args = ast.get.expressionArgs(body[0])
    , deps

  if(args.length === 3) deps = args[1].elements
  else if(args.length === 2) deps = args[0].elements

  return _(deps).map(function(e) { return e.value })
}

function func(body) {
  var args = ast.get.expressionArgs(body[0])

  if(args.length === 1) return args[0]
  if(args.length === 2) return args[1]
  if(args.length === 3) return args[2]
}
