var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:stop-processing')
  , types = require("ast-types").namedTypes

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var iife = false

    walk.recursive(file.ast, {}, {
      CallExpression: function(node, st, c) {
        iife = types.FunctionExpression.check(node.callee)
      }
    })

    if(iife) {
      file.ast = null
      debug('Removing ast, using original content for, ', file.name || file.require)
    }

    this.push(file)
    next()
  })
}
