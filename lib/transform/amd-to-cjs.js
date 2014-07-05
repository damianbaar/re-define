var _ = require('lodash')
  , through = require('through2')
  , walk = require('acorn/util/walk')
  , types = require("ast-types")
  , b = types.builders

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

    var toExclude = config.excludeDeps
      , type
      , args
      , fun
      , deps

    walk.recursive(file.ast, {}, {
      CallExpression: function(node, st, c) {
        args = node.arguments
        type = node.callee && node.callee.name
      }
    })

    if(!(type === 'require') && !(type ==='define')) {
      this.push(file)
      next()
      return
    }

    if(type === 'define') {
      if(args.length === 1) fun = args[0]
      if(args.length === 3) deps = args[1].elements

      file.type = 'define'
    }

    if(type === 'require') {
      if(args.length === 1) fun = args[0]

      file.type = 'require'
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

      _.each(deps.reverse(), function(d, i) {
        var call = b.callExpression( b.identifier('require'), [b.literal(d.require)])
          , decl = b.variableDeclaration('var', [b.variableDeclarator(b.identifier(d.param), call)])

        body.unshift(decl)
      })
    }

    file.ast = b.program(body)

    this.push(file)
    next()
  })
}

