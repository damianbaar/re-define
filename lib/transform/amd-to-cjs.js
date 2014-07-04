var _ = require('lodash')
  , through = require('through2')
  , ast = require('../ast/adapter')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var program = file.ast
      , programBody = program.body

    if(programBody.length !== 1) return

    programBody = programBody[0]

    var isDefine = ast.is.amd('define', programBody) 
      , isRequire = ast.is.amd('require', programBody) 

    if(!isDefine && !isRequire) return

    var toExclude = config.excludeDeps
      , args = ast.get.expressionArgs(programBody)
      , create = ast.create
      , fun
      , deps

    if(isDefine) {
      if(args.length === 1) fun = args[0]
      if(args.length === 3) deps = args[1].elements
    }

    if(isRequire) {
      if(args.length === 1) fun = args[0]
    }

    if(args.length === 2) {
      fun = args[1]
      deps = args[0].elements
    }

    deps = _.map(deps, function(e) { return e.value })

    var block = fun.body
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

    file.ast = create.program(body)

    this.push(file)
    next()
  })
}

