var through = require('through2')
  , generate = require('escodegen').generate
  , _ = require('lodash')

module.exports = function(config) {
  return through.obj(function(bundle, enc, next) {
    _.each(bundle.internal, function(file) {
        if(file.isAST())
          file.contents = new Buffer(generate(file.contents, {format: config.format}))
    })

    this.push(bundle)
    next()
  })
}
