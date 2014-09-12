var acorn = require('acorn')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    //TODO ? json should be treated as object not as string
    if(!file.isNull() && ['.json', '.html'].indexOf(file.ext) > -1) {
      var f = file.contents.toString()
        , c = f.replace(/\r?\n|\r/g,'')
               .replace(/["']/g,'\\\'')

      file.contents = new Buffer('module.exports = \'' + c + '\'')
      file.stopProcessing = true

      this.push(file)
      next()
      return
    }

    this.push(file)
    next()
  })
}

