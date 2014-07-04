var through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(file, enc, next){
    if (file.isNull()) file.contents = fs.createReadStream(file.path)

    if (file.isBuffer()) next()

    if (file.isStream()) {
      file.pipe(through(function(content) {
        file.contents = content
        this.push(file)
        next()
      }.bind(this)))
    }
  })
}
