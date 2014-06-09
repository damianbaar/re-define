var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(paths, enc, next) {
    _.each(paths.split('\n'), function(p) {
      if(fs.statSync(path.resolve(p)).isFile()){
        this.push({path: path.resolve(p)})
      }
    }.bind(this))

    next()
  })
}
