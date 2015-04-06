var through = require('through2')
  , escodegen = require('escodegen')
  , generate = escodegen.generate
  , _ = require('lodash')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    _.each(files, function(file) {
        if(file.isAST()) {

            var a = generate(file.contents, {
              sourceMap:true
            , sourceMapWithCode: true
            , format: config.format})

          file._sourceMap = a.map
          file.contents = new Buffer(a.code)
        }
    })

    this.push(files)
    next()
  })
}
