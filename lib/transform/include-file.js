var _ = require('lodash')
  , through = require('through2')
  , path = require('path')

module.exports = function(config) {
  return through.obj(
    function(files, enc, next) {
      this.push(files)
      next()
    }
  , function(end) {
    _.each(config.include, function(d) {
      var fileAlias = d.split('#')
      this.push({path: path.resolve(config.base, fileAlias[0]), alias: fileAlias[1]})
    }.bind(this))
    end()
  })
}
