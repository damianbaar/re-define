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
          module.revert && module.revert()
          module.stopProcessing = true

          debug('File does not exists, stop processing:', module, module.path)

          self.push(module)
          next()
        }
      })
    }

    if (module.isBuffer()) next()

    if (module.isStream()) loadFromStream()

    function loadFromStream() {
      module.pipe(through(function(content) {
        module.contents = content

        self.push(module)
        next()
      }.bind(this)))
    }
  })
}
