var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(modules, end, callback) {
      var internal
      , external

    // external = _.difference(order, _.pluck(modules, 'name'))

    this.push(config.wrappers[ config.wrapper ](internal, external, config))
    callback()
  })
}
