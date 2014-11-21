var through = require('through2')
  , fs = require('fs')
  , _ = require('lodash')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , async = require('async')
  , hash = require('./util/hash')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    if(!config.development) {
      this.push(files)
      return next()
    }

    var self = this
      , tmp = path.resolve(config.tempFolder)

    async.waterfall([
      function (cb) {
        mkdirp(tmp, function(err) { cb(null) })
      },
      function(cb) {
        async.each(files, function(file, callback) {
          if(file.isNull() || file.fromCache) return callback()

          fs.writeFile(path.join(tmp, hash(file)), stringifyFile(file), function(err) {
            if (err) throw err
            callback()
          })
        }, function(err) {
          cb()
        })
      }
    ], function(err) {
      self.push(files)
      next()
    })

    function stringifyFile(file) {
      function removeContentFromDeps(file) {
        file._deps= _.map(file.dependencies, function(d) {
          return { name: d.name
                 , path: d.path
                 , cwd: d.cwd
                 , base: d.base
                 , requiredAs: d.requiredAs }
        })

        return file
      }

      return JSON.stringify(removeContentFromDeps(file))
    }
  })
}
