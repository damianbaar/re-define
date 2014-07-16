var _ = require('lodash')
  , through = require('through2')
  , walk = require('acorn/util/walk')
  , types = require('ast-types')
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

    if(programBody && programBody.length !== 1) {
      this.push(file)
      next()
      return
    }

    programBody = programBody[0]

    var toExclude = config.excludeDepRef
      , type
      , args
      , fun
      , deps

    walk.ancestor(file.ast, {
      FunctionExpression: function(node, parents) {
        parent = parents[parents.length - 2]
        args = parent.arguments
        type = parent.callee && parent.callee.name
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

    var block = fun.body
      , body = block.body

    if(!_.isEmpty(deps)) {
      deps = _(deps)
             .map(function(e, i) { 
               var param = fun.params[i]
               return { param: param ? param.name : null, require: e.value }
             })
             .filter(function(d) {
                return !_.some( toExclude
                              , function(p) { return new RegExp(p).test(d.require) })
              })
             .filter(function(e) { return !!e.require })
             .value()

      _.each(deps.reverse(), function(d, i) {
        var req = b.callExpression( b.identifier('require'), [b.literal(d.require)])

        if(!!d.require && !!d.param)
          req = b.variableDeclaration('var', [b.variableDeclarator(b.identifier(d.param), req)])
        else if(!!d.require)
          req = b.expressionStatement(req)

        body.unshift(req)
      })
    }

    file.ast = b.program(body)
    file.type = 'js'

    this.push(file)
    next()
  })
}

