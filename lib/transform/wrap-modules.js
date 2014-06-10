var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(modules, end, callback) {
    this.push(config.wrappers[ config.wrapper ](modules.internal, modules.external, config))
    callback()
  })
}
