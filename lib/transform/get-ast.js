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
    
    var ast

    try {
      ast = acorn.parse(file.contents)
    } catch(e) {
      file.stopProcessing = true
      debug('Unable to parse', file)
    } finally {
      ast && (file.contents = ast)
    }

    this.push(file)
    next()
  })
}

