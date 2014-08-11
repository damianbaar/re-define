var acorn = require('acorn')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {

    if(!file.isNull() && file.ext === '.html') {
      var f = file.contents.toString()
        , c = f.replace(/\r?\n|\r/g,'')
               .replace(/["']/g,'\\\'')

      file.contents = new Buffer('\'' + c + '\'')
      file.stopProcessing = true

      this.push(file)
      next()
      return
    }

    this.push(file)
    next()
  })
}

