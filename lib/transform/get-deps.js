var through = require('through2')
  , walk = require('acorn/util/walk')
  , path = require('path')
  , Module = require('../Module')

module.exports = function(config, writer) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST() || file.stopProcessing) {
      this.push(file)
      next()
      return
    }

    var deps = []

    walk.simple(file.contents, {
      CallExpression: function(node) {
        var callee = node.callee 
        if(callee && callee.name === 'require') {
          var args = node.arguments

          if(!args) return

          if(args.length === 1 && args[0].type === 'Literal') {
            var req = args[0].value
              , dep = Module({ parent: file.parent || file.name
                      , base: file.base
                      , requiredAs: req })

            var _filename = hasExt(req) ? req : req + '.js'
              , _path = path.resolve(path.dirname(file.path), _filename)
              , _rel = path.relative(file.base, _path)

            dep.path = _path
            dep.name = _rel
            dep.reference = _rel

            args[0].value = dep.name

            dep.revert = function() { 
              args[0].value = req 
              dep.path = dep.name = dep.reference = req
            }
            dep.update = function(name) { args[0].value = name }

            deps.push(dep)
            writer.write(dep)
          } else {
            console.log('error', 're-define require static require calls')
          }
        }
      }
    })

    function hasExt(val) { return !!path.extname(val) }

    file.deps = deps

    this.push(file)
    next()
  })
}

