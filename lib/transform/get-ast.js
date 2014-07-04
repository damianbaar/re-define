var acorn = require('acorn')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.ext !== '.js') {
      this.push(file)
      next()
      return
    }

    file.ast = acorn.parse(file.contents)

    this.push(file)
    next()
  })
}

