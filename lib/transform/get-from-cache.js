var through = require('through2')
  , fs = require('fs')
  , path = require('path')
  , debug = require('debug')('re-define:transform:get-from-cache')
  , async = require('async')
  , _ = require('lodash')
  , hash = require('./util/hash')
  , Module = require('re-define-module')

module.exports = function(config, writer) {
  var tmp = config.tempFolder && require('path').resolve(config.tempFolder)

  return through.obj(function(file, enc, next){
    var self = this

    if(!config.development) {
      this.push(file)
      next()
      return
    }

    async.waterfall([
      function(cb) {
        fs.stat(file.path, function(err, stat) {
          file.stat = stat
          cb(stat ? null : 'not exists')
        })
      }
    , function(cb) {
        cb(null, path.join(tmp, hash(file)))
      }
    , function(cachedFile, cb) {
        fs.exists(cachedFile, function(e) {
          cb(e ? null : 'not exists in cache', cachedFile)
        })
      }
    , function(cachedFile, cb) {
        fs.readFile(cachedFile, function(err, fromCache) {
          fromCache = JSON.parse(fromCache)

          file.contents = new Buffer(fromCache._contents)
          file.dependencies = _.map(fromCache._deps, function(d) { 
            var m = Module(d);
            writer.write(m)
            return m
          })

          file.stopProcessing = true
          file.fromCache = true

          cb(null)
        })
      }
    ], function(err) {
      self.push(file)
      next()
    })
  })
}
