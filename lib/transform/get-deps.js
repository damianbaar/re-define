var _ = require('lodash')
  , through = require('through2')
  , walk = require('acorn/util/walk')
  , path = require('path')
  , Module = require('re-define-module')
  , generate = require('escodegen').generate

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

            if(config.map && config.map[req]) req = config.map[req]

            var dep = Module({base: file.base , requiredAs: req })

            var _filename = hasExt(req) ? req : req + '.js'
              , _path = path.resolve(path.dirname(file.path), _filename)
              , _rel = path.relative(file.base, _path)

            dep.path = _path
            dep.name = _rel

            args[0].value = dep.name

            dep.revert = function() { 
              args[0].value = req 
              dep.path = dep.name = req
            }
            dep.update = function(name) { 
              args[0].value = name 
              dep.name = name
            }

            deps.push(dep)
            writer.write(dep)
          } else {
            config.showWarnings && console.log('//warning: re-define rewrite only static require calls', file, file.path, generate(node))
          }
        }
      }
    })

    function hasExt(val) { return !!path.extname(val) }

    file.dependencies = deps

    this.push(file)
    next()
  })
}

