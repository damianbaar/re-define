var acorn = require('acorn/acorn_loose')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.ext !== '.js') {
      this.push(file)
      next()
      return
    }

    file.ast = acorn.parse_dammit(file.contents)

    this.push(file)
    next()
  })
}

