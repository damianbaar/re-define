var _ = require('lodash')
  , through = require('through2')
  , walk = require('acorn/util/walk')
  , types = require('ast-types')
  , b = types.builders
  , n = types.namedTypes

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST()) {
      this.push(file)
      next()
      return
    }

    var program = file.contents
      , programBody = program.body

    programBody = _.filter(programBody, function(d) {
      return !n.EmptyStatement.check(d)
    })

    if(programBody && programBody.length !== 1) {
      this.push(file)
      next()
      return
    }

    var toExclude = config.excludeAMDModules
      , type
      , args
      , fun
      , deps

    walk.ancestor(program, {
      FunctionExpression: function(node, parents) {
        parent = parents[parents.length - 2]
        args = parent.arguments
        type = parent.callee && parent.callee.name
      }
    , ObjectExpression: function(node, parents) {
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

    var block = n.FunctionExpression.check(fun) && fun.body
      , body = n.BlockStatement.check(block) && block.body

    if(n.ObjectExpression.check(fun)) {
      var a = b.expressionStatement( 
                b.assignmentExpression(
                  '=', b.memberExpression(
                        b.identifier('module')
                        , b.identifier('exports'), false)
                        , fun))

      file.contents = b.program([a])

      this.push(file)
      next()
      return
    }

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

    file.contents = b.program(body)

    this.push(file)
    next()
  })
}

