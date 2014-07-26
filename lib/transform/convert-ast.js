var through = require('through2')
  , generate = require('escodegen').generate
  , _ = require('lodash')

module.exports = function(config) {
  var format
  return through.obj(function(files, enc, next) {
    _.each(files, function(file) {
      if(file.isAST()) {
        format = {
          indent: { style: '  ', base: file.type === 'iife' ? 2 : 5 },
          space: ' ',
          safeConcatenation:true 
        }

        file.contents = new Buffer(generate(file.contents, {format: format }))
      }
    })

    this.push(files)
    next()
  })
}
