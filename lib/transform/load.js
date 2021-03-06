var through = require('through2')
  , fs = require('fs')
  , path = require('path')
  , debug = require('debug')('re-define:file:load')
  , async = require('async')
  , _ = require('lodash')

module.exports = function(config) {
  var alreadyLoaded = {}

  return through.obj(function(file, enc, next){
    var self = this
    
    //TODO would be better to move that bit to separated stream
    if(config.empty.indexOf(file.requiredAs) > -1) {
      file.contents = new Buffer('return {}')
      file.stopProcessing = true
    }

    if(!file.path || !file.isNull() || file.isBuffer()) {
      this.push(file)
      next()
      return
    }

    if (file.isNull()) {
      fs.exists(file.path, function(exists) {
        if(!exists) return _end()

        fs.stat(file.path, function(err, stats) {
          exists = stats.isFile()

          if(exists) {
            if(!alreadyLoaded[file.path]) {
              file.contents = fs.createReadStream(file.path)
              loadFromStream()
            } else {
              file.stopProcessing = true
              self.push(file)
              next()
            }
          } else _end()
        })
      })

      function _end() {
        debug('File does not exists, passing it further:', file, file.path)

        self.push(file)
        next()
      }
    }

    if (file.isStream()) loadFromStream()

    function loadFromStream() {
      var buffers = []

      alreadyLoaded[file.path] = true

      file.pipe(through(function(chunk, enc, next) {
        buffers.push(chunk)
        next()
      }, function() {
        file.contents = 
          !!buffers.length 
            ? Buffer.concat(buffers)
            : new Buffer('"<div>error: empty file, ' + file.path + '</div>"')

        self.push(file)
        next()
      }.bind(this)))
    }
  })
}
