var through = require('through2')
  , fs = require('fs')
  , async = require('async')
  , _ = require('lodash')

module.exports = function(config) {
  return through.obj(function(file, enc, next){
    var self = this

    if(!file.isNull()) {
      this.push(file)
      next()
      return
    }

    var path = file.path && file.path.replace(file.ext, '')
      , paths = ['index.js', 'main.js']

    paths = _.map(paths, function(p) { return path + '/' + p })

    if(config.jsExt !== file.ext) paths.push(file.path + config.jsExt)

    async.detect([file.path].concat(paths.reverse()), fs.exists, function(p) {
      if(p) file.path = p

      self.push(file)
      next()
    })
  })
}
