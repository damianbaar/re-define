var through = require('through2')
  , walk = require('acorn/util/walk')
  , path = require('path')
  , _ = require('lodash')
  , Module = require('../module')

module.exports = function(config, writer) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST()) {
      this.push(file)
      next()
      return
    }

    var deps = []
      , external = []

    walk.simple(file.contents, {
      CallExpression: function(node) {
        var callee = node.callee 
        if(callee && callee.name === 'require') {
          var args = node.arguments

          if(!args) return

          if(args.length === 1 && args[0].type === 'Literal') {
            var req = args[0].value
              , dep = { base: file.base
                      , parent: file.parent || file.name }

            dep.updateParent = _.partial(function() { 
              var s = this
             _(file.deps)
              .each(function(d) {
                if(d.reference === args[0].value) {
                  d.name = s.name
                  d.reference = s.reference
                }
              })

              args[0].value = this.reference 
            })

            if(hasExt(req) || req.indexOf('.') === -1) {
              dep.path = dep.name = dep.reference = req
              deps.push(dep)

              writer.write(Module(dep))

              return
            }

            var _filename = req + '.js'
              , _path = path.resolve(path.dirname(file.path), _filename)
              , _rel = path.relative(file.base, _path)
              , _name = _rel

            dep.path = _path
            dep.name = _name
            dep.reference = _name

            dep.updateParent()

            deps.push(dep)
            writer.write(Module(dep))

            function hasExt(val) { return !!path.extname(val) }

          } else {
            console.log('error', 're-define require static require calls')
          }
        }
      }
    })

    file.deps = deps

    this.push(file)
    next()
  })
}

