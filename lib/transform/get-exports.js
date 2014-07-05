var through = require('through2')
  , walk = require('acorn/util/walk')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var deps = file.deps

    deps = (file.deps || [])

    walk.ancestor(file.ast, {
      MemberExpression: function(node, parents) {
        var obj = node.object
          , prop = node.property

        if(obj.name === 'module' && prop.name === 'exports') {
          // console.log('has exports', file)
          var assignment = parents[parents.length - 2]
            , realParent = parents[parents.length - 3]

          realParent.expression = assignment.right

          // console.log(parents)
          // console.log(assignment)
        }
      },
      ExpressionStatement: function(node) {

      },
      ReturnStatement: function(node) {
        // if(file.type === 'require')
          // console.log('require has return', file)
      }
    })

    file.exports = exports

    this.push(file)
    next()
  })
}




