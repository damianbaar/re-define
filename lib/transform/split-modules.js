var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(content, enc, next) {
    _.each(content.split(config.separator), function(p) {
        this.push({path: './_.js', content: p})
    }.bind(this))

    next()
  })
}
