var through = require('through2')
  , fs = require('fs')
  , debug = require('debug')('re-define:file:load')

module.exports = function(config) {
  return through.obj(function(module, enc, next){
    var self = this

    if(!module.path) {
      this.push(module)
      next()
      return
    }

    if (module.isNull()) {
      fs.exists(module.path, function(r) {
        if(r) {
          module.contents = fs.createReadStream(module.path)
          loadFromStream()
        } else {
          self.emit('not-exists', module)

          module.revert && module.revert()
          module.stopProcessing = true
          module.external = true

          debug('File does not exists, passing it further:', module, module.path)

          self.push(module)
          next()
        }
      })
    }

    if (module.isBuffer()) {
      this.push(module)
      next()
    }

    if (module.isStream()) loadFromStream()

    function loadFromStream() {
      module.pipe(through(function(content) {
        module.contents = content

        self.push(module)
        next()
      }, function(a) {
        module.contents = new Buffer('""')
        self.push(module)

        debug('File is empty:', module, module.path)
        next()
      }.bind(this)))
    }
  })
}
