var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(module, enc, next){
    fs.readFile(module.path, 'utf-8', function(err, data) {
      this.push(_.extend(module, { content: data }))
      next()
    }.bind(this))
  })
}
