var acorn = require('acorn')
  , through = require('through2')
  , format = require('util').format
  , debug = require('debug')('re-define:transform:get-ast')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull() || file.stopProcessing) {
      this.push(file)
      next()
      return
    }

    debug('parsing file', file.path)

    var ast

    try {
      ast = acorn.parse(file.contents)
    } catch(e) {
      file.stopProcessing = true

      if(config.jsExt === file.ext) {
        var err = format( 'Unable to parse, path: %s, requiredAs: %s, error: %o'
                        , file.path, file.requiredAs, e)

        throw new Error(err)
      }

      debug('Unable to parse', file, e)
    } finally {
      ast && (file.contents = ast)
    }

    this.push(file)
    next()
  })
}

