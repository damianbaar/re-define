var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:wrap-modules')
  , File = require('vinyl')

module.exports = function(config) {
  return through.obj(function(bundle, enc, next) {
    var file = new File({ cwd: process.cwd()
                        , base: config.base
                        , path: bundle.output })

    file.contents = new Buffer(config.wrappers[ config.wrapper ](bundle, config))

    debug('Wrapping: %o', file)

    this.push(file)
    next()
  })
}
