var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(content, enc, next) {
    _.each(content.split(config.separator), function(p) {
      //TODO check content html/js
      this.push({ext: '.js', content: p})
      next()
    }.bind(this))
  })
}
