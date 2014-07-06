var acorn = require('acorn/acorn_loose')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.ext !== '.js') {
      this.push(file)
      next()
      return
    }

    try {
      file.ast = acorn.parse_dammit(file.contents)
    } catch(e) {
      this.emit('error', new Error(file))
    }

    this.push(file)
    next()
  })
}

