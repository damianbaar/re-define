var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , parse = require('acorn/acorn_loose').parse_dammit
  , generate = require('escodegen').generate

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
            , exportOwner = parents[parents.length - 3]
            , returns = parse('return ' + generate(assignment.right))

          program.body = _.map(program.body, function(d) { 
            return exportOwner === d ? returns : d 
          })
        }
      }
    })

    this.push(file)
    next()
  })
}




