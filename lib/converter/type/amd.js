var _ = require('lodash')
  , ast = require('../ast/adapter')

module.exports = {
  match     : match
, attach    : attach
}

function match(getProgram) {
  var body = getProgram().body
  if(body.length === 1) return isDefine(body[0]) || isRequire(body[0])
}

function attach(getProgram, config) {
  var code = getProgram().body[0]
    , toExclude = config.excludeDeps
    , create = ast.create
    , fun = getFun(code)
    , deps = getDeps(code)
    , block = fun.body
    , body = block.body

  if(!_.isEmpty(deps)) {
    deps = _.map(deps, function(d, i) {
              return !_.some( toExclude
                            , function(p) { return new RegExp(p).test(d) })
                          ? d : null
            })

    deps = _(fun.params)
           .map(function(e, i) { 
              return { param: e.name , require: deps[i] }
           })
           .filter(function(e) { return !!e.require && !!e.param })
           .value()

    _.each(deps.reverse(), function(d) {
      body.unshift(create.var(d.param, create.require(d.require)))
    })
  }

  return { ast : create.program(body) }

  function getDeps(code) {
    var args = ast.get.expressionArgs(code)
      , deps

    if(isDefine(code)) {
      if(args.length === 3) deps = args[1].elements
      if(args.length === 2) deps = args[0].elements
    }

    if(isRequire(code)) {
      if(args.length === 2) deps = args[0].elements
    }

    deps = _.map(deps, function(e) { return e.value })

    return deps
  }

  function getFun(code) {
    var args = ast.get.expressionArgs(code)
    
    if(isDefine(code)) {
      if(args.length === 1) return args[0]
      if(args.length === 2) return args[1]
    }
    
    if(isRequire(code)) {
      if(args.length === 1) return args[0]
      if(args.length === 2) return args[1]
      if(args.length === 3) return args[2]
    }
  }
}

function isDefine(block) { return ast.is.amd('define', block) }
function isRequire(block) { return ast.is.amd('require', block) }

