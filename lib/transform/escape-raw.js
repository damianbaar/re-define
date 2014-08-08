var acorn = require('acorn')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.isNull() && file.ext === '.html') {
      //TODO could be handled in template
      file.contents = new Buffer('\''+file.contents.toString().replace(/\r?\n|\r/g,'')+'\'')
      file.stopProcessing = true

      this.push(file)
      next()
      return
    }

    this.push(file)
    next()
  })
}

