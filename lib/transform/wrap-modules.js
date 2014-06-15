var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:wrap-modules')

module.exports = function(config) {
  return through.obj(function(modules, enc, next) {
    debug('%s', config.wrapper)
    this.push(config.wrappers[ config.wrapper ](modules.internal, modules.external, config))
    next()
  })
}
