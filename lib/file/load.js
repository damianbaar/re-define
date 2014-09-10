var through = require('through2')
  , fs = require('fs')
  , debug = require('debug')('re-define:file:load')

module.exports = function(config) {
  return through.obj(function(file, enc, next){
    var self = this

    if(!file.path) {
      this.push(file)
      next()
      return
    }

    if (file.isNull()) {
      fs.exists(file.path, function(r) {
        self.emit('exists', r, file)

        if(r) {
          file.contents = fs.createReadStream(file.path)
          loadFromStream()
        } else {
          debug('File does not exists, passing it further:', file, file.path)

          self.push(file)
          next()
        }
      })
    }

    if (file.isBuffer()) {
      this.push(file)
      next()
    }

    if (file.isStream()) loadFromStream()

    function loadFromStream() {
      var buffers = []

      file.pipe(through(function(chunk, enc, next) {
          buffers.push(chunk)
          next()
      }, function(end) {
          file.contents = Buffer.concat(buffers)
          self.push(file)
          next()
          end()
      }.bind(this)))
    }
  })
}
