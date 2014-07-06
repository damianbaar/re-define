var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:stop-processing')

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
        iife = node.callee && node.callee.type === 'FunctionExpression'
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
