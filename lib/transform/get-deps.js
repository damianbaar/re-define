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

            if(/.*\/$/g.test(req)) req = req + 'index.js' //require('./lib/')
            if(config.map && config.map[req]) req = config.map[req]

            var dep = Module({base: file.base , requiredAs: req })
              , external = req[0] != '.'

            var _filename = hasExt(req) ? req : req + '.js'
              , _path = path.resolve(path.dirname(file.path), _filename)

            if(external) _path = req
            if(file.external) dep.external = true

            dep.path = _path

            if(file.pkgName) dep.pkgName = file.pkgName
            if(file.base) dep.base = file.base 

            args[0].value = dep.name

            dep.revert = function() { 
              args[0].value = req 
              dep.name = req
            }
            dep.update = function(name) { 
              args[0].value = name 
              dep.name = name
            }

            deps.push(dep)
          } else {
            JSON.parse(config.showWarnings) && console.log('//warning: re-define rewrite only static require calls', file, file.path, generate(node))
          }
        }
      }
    })

    function hasExt(val) { return !!path.extname(val) }

    _.each(deps, function(d) { writer.write(d) })
    file.dependencies = deps

    this.push(file)
    next()
  })
}

