var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(module, enc, next){
    fs.createReadStream(module.path, 'utf-8')
      .pipe(through.obj(function(m,e,c) {
        this.push(_.extend(module, { content: m }))
        next()
      }.bind(this)))
  })
}
