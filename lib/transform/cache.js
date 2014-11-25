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

module.exports = function(config) { 
  var tempFolder = config.tempFolder && path.resolve(config.tempFolder)

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

      async.waterfall([
        _.partial(mkdirp, tempFolder),
        function(exists, cb) { 
          if(config.autoClean) fs.readdir(tempFolder, cb)
          else cb(null, [])
        },
        function(cacheEntries, cb) {
          //filter out each old entry beside current/newest one
          var toRemove = 
            _(files).map(function(f) {
              return _.filter(cacheEntries, function(c) { 
                return c.indexOf(escape(relative(f.path))) > -1 
                       && c != f.fromCache
              })
            })
            .flatten()
            .value()

          async.each(toRemove, function(file, next) {
            fs.unlink(path.join(tempFolder, file), next)
          }, cb)
        },
        function(cb) {
          async.each(files, function(file, callback) {
            if(file.isNull() || file.fromCache) return callback()

            fs.writeFile(cachedFilename(file), stringifyFile(file)
            , function(err) {
              if (err) throw err

              debug('Caching file to %s', file.name)
              callback()
            })
          }, cb)
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
                              , cwd: file.cwd
                              , base: file.base
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
        _.partial(fs.stat, file.path)
      , function(stat, cb) {
          file.stat = stat
          cb(null, cachedFilename(file))
        }
      , function(cachedFile, cb) {
          fs.exists(cachedFile, _.partial(cb, null, cachedFile))
        }
      , function(cachedFile, exists, cb) {
          if(!exists) return cb('not exists')

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
            file.fromCache = path.relative(tempFolder, cachedFile)

            cb()
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

  function cachedFilename(file) {
    return path.join(tempFolder, escape(hash(file))) + '.js'

    function hash(file) {
      var hash = crc.crc32(file.path + file.stat.mtime).toString(16)
      return relative(file.path) + '_' + hash
    }
  }

  function escape(val) { return val.replace(/\\|\/|\./g,'_') }
}


