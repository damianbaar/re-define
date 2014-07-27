var through = require('through2')
  , walk = require('acorn/util/walk')
  , types = require('ast-types')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST()) {
      this.push(file)
      next()
      return
    }

    walk.ancestor(file.contents, {
      MemberExpression: function(node, parents, c) {
        var obj = node.object
          , prop = node.property

        if(obj.name === 'module' && prop.name === 'exports') {
          var assignment = parents[parents.length - 2]

          if(assignment.left)
            assignment.left = assignment.left.property
        }
      }
    })

    this.push(file)
    next()
  })
}
