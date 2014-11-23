var through = require('through2')
  , fs = require('fs')
  , _ = require('lodash')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , async = require('async')
  , crc = require('crc')
  , Module = require('re-define-module')
  , debug = require('debug')('re-define:transform:cache')
  , relative = _.partial(path.relative, process.cwd())
  , tempFolder

module.exports = function(config) { 
  tempFolder = config.tempFolder && require('path').resolve(config.tempFolder)

  return {
    load: load
  , save: save
  }

  function save() {
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

            fs.writeFile(path.join(tmp, cachedFilename(file)), stringifyFile(file)
            , function(err) {
              if (err) throw err

              debug('Caching file to %s %s', file.name)
              callback()
            })
          })
          cb()
        }
      ], function(err) {
        self.push(files)
        next()
      })

      function stringifyFile(file) {
        var deps
          , a = {}

        deps = _.map(file.dependencies, function(d) {
          return { name:d.name
                 , path: d.path
                 , requiredAs: d.requiredAs }
        })

        return JSON.stringify({ name:file.name
                              , path: file.path
                              , deps: deps
                              , cwd: cwd
                              , base: base
                              , contents: file.contents})
      }
    })
  }

  function load(writer) {
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
          cb(null, cachedFilename(file))
        }
      , function(cachedFile, cb) {
          fs.exists(cachedFile, function(e) {
            cb(e ? null : 'not exists in cache', cachedFile)
          })
        }
      , function(cachedFile, cb) {
          fs.readFile(cachedFile, function(err, fromCache) {
            debug('Loading from cache %s %s', cachedFile, file.name)

            fromCache = JSON.parse(fromCache)
            if(fromCache.contents)
              file.contents = new Buffer(fromCache.contents)

            file.name = fromCache.name
            file.base = fromCache.base
            file.cwd = fromCache.cwd

            file.dependencies = _.map(fromCache.deps, function(d) { 
              var m = Module(d)
              writer.write(m)

              return m
            })

            file.stopProcessing = true
            file.fromCache = true

            cb(null)
          })
        }
      ], function(err) {
        if(err) {
          debug('Not exists in cache %s %s %s',file.path, file.requiredAs)
        }
        self.push(file)
        next()
      })
    })
  }
}


function cachedFilename(file) {
  return escape(path.join(tempFolder, hash(file))) + '.json'

  function hash(file) {
    var hash = crc.crc32(file.path + file.stat.mtime).toString(16)
    return relative(file.path) + '_' + hash
  }

  function escape(val) { return val.replace(/\/|\./g,'_') }
}
