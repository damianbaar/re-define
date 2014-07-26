var acorn = require('acorn')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:get-ast')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {

    if(file.isNull()) {
      this.push(file)
      next()
      return
    }

    try {
      file.contents = acorn.parse(file.contents)
    } catch(e) {
      debug('Unable to parse', file)
    }

    this.push(file)
    next()
  })
}

