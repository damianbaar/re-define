var parse = require('acorn').parse
  , through = require('through2')
  , format = require('util').format
  , strip = require('strip-comments')
  , path = require('path')
  , debug = require('debug')('re-define:transform:get-ast')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull() || file.stopProcessing || file.isAST()) {
      debug('Skipping step for %s.', file.name)
      this.push(file)
      next()
      return
    }

    debug('parsing file', file.path)

    var ast

    try {
      var sourceFile = (path.relative(process.cwd(), file.path))

      file.contents = new Buffer(strip(file.contents.toString()))
      ast = parse(file.contents, {locations:true, sourceFile:sourceFile})

      file._sourceFile = sourceFile
    } catch(e) {
      file.stopProcessing = true

      if(config.jsExt && config.jsExt.indexOf(file.ext) > -1) {
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

