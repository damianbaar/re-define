var acorn = require('acorn')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.ext === '.html') {
      file.contents = new Buffer('\''+file.contents.toString().replace(/\r?\n|\r/g,'')+'\'')
      file.type = 'raw'

      this.push(file)
      next()
      return
    }

    this.push(file)
    next()
  })
}

