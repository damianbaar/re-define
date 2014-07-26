var through = require('through2')
  , fs = require('fs')
  , debug = require('debug')('re-define:file:load')

module.exports = function(config) {
  return through.obj(function(file, enc, next){
    var self = this

    if (file.isNull()) {
      fs.exists(file.path, function(r) {
        if(r) {
          file.contents = fs.createReadStream(file.path)
          loadFromStream()
        } else {
          debug('File does not exists', file)
          self.push(file)
          next()
        }
      })
    }

    if (file.isBuffer()) next()

    if (file.isStream()) {
    }

    function loadFromStream() {
      file.pipe(through(function(content) {
        file.contents = content

        self.push(file)
        next()
      }.bind(this)))
    }
  })
}
