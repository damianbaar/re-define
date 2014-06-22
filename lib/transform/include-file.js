var _ = require('lodash')
  , through = require('through2')
  , exists = require('fs').exists
  , path = require('path')
  , debug = require('debug')('re-define:transform:load-file')

module.exports = function(config) {
  return through.obj(
    function(file, enc, next) {
      debug('%s', file.path)

      this.push(file)
      next()
    }
  , function(end) {
    _.each(config.include, function(d) {
      var fileAlias = d.split('#')
      debug('including %s, as %s', fileAlias[0], fileAlias[1])

      if(exists)
        this.push({path: path.resolve(config.base, fileAlias[0]), external: true, alias: fileAlias[1]})
      else
        debug('File does not exists'.error, fileAlias[0], fileAlias[1])

    }.bind(this))
    end()
  })
}
