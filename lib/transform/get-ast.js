var acorn = require('acorn')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:get-ast')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {

    if(file.isNull() || file.stopProcessing) {
      this.push(file)
      next()
      return
    }

    try {
      console.log(file.contents.toString())
      file.contents = acorn.parse(file.contents)
    } catch(e) {
      file.stopProcessing = true
      debug('Unable to parse', file)
    }

    this.push(file)
    next()
  })
}

