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
      fs.exists(file.path, function(exists) {
        if(exists) {
          if(!alreadyLoaded[file.path]) {
            file.contents = fs.createReadStream(file.path)
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
