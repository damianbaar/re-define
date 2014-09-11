var through = require('through2')
  , generate = require('escodegen').generate
  , _ = require('lodash')

module.exports = function(config) {
  var format = {
            indent: { style: '  ', base: 2 },
            space: ' ',
            safeConcatenation:true 
          }

  return through.obj(function(files, enc, next) {
    _.each(files.internal, function(file) {
        if(file.isAST())
          file.contents = new Buffer(generate(file.contents, {format: format }))
    })

    this.push(files)
    next()
  })
}
