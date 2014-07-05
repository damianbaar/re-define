var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , generate = require('escodegen').generate

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var exports = file.exports
      , toRemove = []
      , program = file.ast

    exports = (file.exports || [])

    walk.ancestor(file.ast, {
      ReturnStatement: function(node, parents) {
        if(file.type === 'require') {
          toRemove.push(node)
          exports.push(generate(node))
        }
      },
      MemberExpression: function(node, parents, c) {
        var obj = node.object
          , prop = node.property

        if(obj.name === 'module' && prop.name === 'exports') {
          var assignment = parents[parents.length - 2]
            , exportOwner = parents[parents.length - 3]

          toRemove.push(exportOwner)
          exports.push(generate(assignment.right))
        }
      }
    })

    program.body = getExportedValue(program.body, toRemove)

    function getExportedValue(body, remove) {
      return _(body).map(function(d) { return remove.indexOf(d) > -1 ? null : d })
            .compact()
            .value()
    }

    file.exports = exports

    this.push(file)
    next()
  })
}




