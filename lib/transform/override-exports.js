var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , types = require('ast-types')
  , n = types.namedTypes
  , b = types.builders

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var program = file.ast

    walk.ancestor(file.ast, {
      MemberExpression: function(node, parents, c) {
        var obj = node.object
          , prop = node.property

        if(obj.name === 'module' && prop.name === 'exports') {
          var assignment = parents[parents.length - 2]
          assignment.left = assignment.left.property
        }
      }
    })

    this.push(file)
    next()
  })
}
