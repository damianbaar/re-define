var _ = require('lodash')
  , through = require('through2')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:transform:amd-plugin')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST()) {
      this.push(file)
      next()
      return
    }

    walk.simple(file.contents, {
      CallExpression: function(node) {
        var callee = node.callee 
        if(callee && callee.name === 'require') {
          var args = node.arguments

          if(!args) return

          if(args.length === 1 && args[0].type === 'Literal') {

            var req = args[0].value
              , plugin = _.find(config.plugins, function(d) { 
                return new RegExp(d).test(req) && d
              })

            if(plugin) args[0].value = req.replace(new RegExp(plugin), '')
          }
        }
      }
    })

    this.push(file)
    next()
  })
}
