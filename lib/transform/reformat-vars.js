/**
 * var a = 10, b = 10, c = 10
 * ====>
 * var a = 10
 * var b = 10
 * var c = 10
*/

var _ = require('lodash')
  , through = require('through2')
  , walk = require('acorn/util/walk')
  , types = require('ast-types')
  , b = types.builders

module.exports = function(config, writer) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST() || file.stopProcessing || !config.reformatVars) {
      this.push(file)
      next()
      return
    }

    walk.ancestor(file.contents, {
      VariableDeclaration : function(node, parents) {
        if(node && node.declarations && node.declarations.length > 1) {
          var block = parents[parents.length - 2]
            , body = block && block.body

          if(_.isArray(body) && (idx = body.indexOf(node)) > -1) {
            var rest = _.map(_.tail(node.declarations), function(a, i) {
              block.body.splice(idx + 1 + i, 0, b.variableDeclaration('var', [a]))
            })

            node.declarations = [_.head(node.declarations)]
          }
        }
      }
    })

    this.push(file)
    next()
  })
}
