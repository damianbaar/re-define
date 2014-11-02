var through = require('through2')
  , fs = require('fs')
  , debug = require('debug')('re-define:file:load')
  , async = require('async')
  , _ = require('lodash')

module.exports = function(config) {
  var alreadyLoaded = {}

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

      if(config.jsExt !== file.ext) paths.push(file.path + config.jsExt)

      async.detect([file.path].concat(paths.reverse()), fs.exists, function(p) {
        if(p) {
          file.path = p

          if(!alreadyLoaded[file.path]) {
            file.contents = fs.createReadStream(p)
            loadFromStream()
          } else {
            self.emit('alreadyLoaded', file)
            file.stopProcessing = true
            self.push(file)
            next()
          }
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

      alreadyLoaded[file.path] = true

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
