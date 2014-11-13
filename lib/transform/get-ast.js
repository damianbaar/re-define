var parse = require('acorn/acorn_loose').parse_dammit
  , through = require('through2')
  , format = require('util').format
  , debug = require('debug')('re-define:transform:get-ast')
  , transform = require('react-tools').transform

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull() || file.stopProcessing || file.isAST()) {
      this.push(file)
      next()
      return
    }

    debug('parsing file', file.path)
    
    //TODO create another plugin
    try {
      file.contents = new Buffer(transform(file.contents.toString(), {}))
    } catch (error) {
      error.message += ' in "' + file + '"';
      console.log(error)
    }

    var ast

    try {
      ast = parse(file.contents)
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

