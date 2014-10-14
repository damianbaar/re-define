var through = require('through2')
  , fs = require('fs')
  , debug = require('debug')('re-define:file:load')
  , async = require('async')
  , _ = require('lodash')

module.exports = function(config) {
  return through.obj(function(file, enc, next){
    var self = this

    if(!file.path || !file.isNull() || file.isBuffer()) {
      this.push(file)
      next()
      return
    }

    if (file.isNull()) {
      var path = file.path && file.path.replace(file.ext, '')
        , paths = ['index.js', 'main.js']

      paths = _.map(paths, function(p) { return path + '/' + p })

      async.detect([file.path].concat(paths), fs.exists, function(p) {
        if(p) {
          file.path = p
          file.contents = fs.createReadStream(file.path)
          loadFromStream()
        } else {
          debug('File does not exists, passing it further:', file, file.path)

          self.push(file)
          next()
        }
      })
    }

    if (file.isStream()) loadFromStream()

    function loadFromStream() {
      var buffers = []

      file.pipe(through(function(chunk, enc, next) {
          buffers.push(chunk)
          next()
      }, function() {
          file.contents = Buffer.concat(buffers)
          self.push(file)
          next()
      }.bind(this)))
    }
  })
}
