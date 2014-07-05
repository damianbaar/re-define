var through = require('through2')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:get-deps')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var iife = false

    walk.recursive(file.ast, {}, {
      CallExpression: function(node, st, c) {
        iife = node.callee && node.callee.type === 'FunctionExpression'
      }
    })

    if(iife) {
      debug('Skipping iife', file.name || file.require)
      this.push(file)
      next()
      return
    }

    var deps = file.deps

    deps = (file.deps || [])

    walk.simple(file.ast, {
      CallExpression: function(node) {
        var callee = node.callee 
        if(callee && callee.name === 'require') {
          node.callee.name = config.internalRequire

          var args = node.arguments

          if(!args) return

          if(args.length === 1 && args[0].type === 'Literal') {
            var req = args[0].value
              , dep = { path: req
                      , require: req
                      , update: update()
              }

            deps.push(dep)

            function update() { return function() { args[0].value = dep.require } }
          } else {
            file.complex = true
          }
        }
      }
    })

    file.deps = deps

    this.push(file)
    next()
  })
}

