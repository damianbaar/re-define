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
  , rmrf = require('rimraf')

//TODO refactoring needed

module.exports = function(config) { 
  var tempFolder = config.tempFolder && path.resolve(config.tempFolder)

  //I believe better is to do sync op here, remove all and GO GO GO!
  invalidate()

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
          //filter out each old entry skiping newest one
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
          var _config = _.clone(config)

          if(!_.isEmpty(config.detectChangeIn)) {
            _.each(config.detectChangeIn, function(d) {
              if(fs.existsSync(process.cwd() + '/' + d))
                _config[d] = fs.statSync(process.cwd() + '/node_modules').mtime
            }) 
          }

          var conf = Module({ contents: new Buffer(JSON.stringify(_config))
                            , path: 'config.json'
                           })

          async.each(files.concat([conf]), function(file, callback) {
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
                              , contents: file.contents.toString() })
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
          if(!exists) {
            file.needsInvalidation = true
            return cb('not exists')
          }

          //TODO to consider #optimization: check all files if exists and do the same what in slices
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
        if(err) debug('Not exists in cache %s %s %o',file.path, file.name, err)

        self.push(file)
        next()
      })
    })
  }

  function invalidate() {
    if(!config.development) return

    var configPath = cachedFilename({ path: 'config.json' })
      , exists = fs.existsSync(configPath)
      , __conf = exists && fs.readFileSync(configPath, 'utf8')

    var conf = __conf && JSON.parse(JSON.parse(__conf).contents)
      , props = _.keys(conf)
      , cause
      , needsRevalidation = _.some(props, function(p) {
          var c = !_.isEqual(_.compact(conf[p]), _.compact(config[p])) 
          if(c && !cause) cause = p

          return c
        })

    if(needsRevalidation) {
      rmrf.sync(tempFolder)
      debug('Invalidating cache because of: ', cause, 'change')
    } 
  }

  function cachedFilename(file) {
    return path.join(tempFolder, escape(hash(file))) + '.js'

    function hash(file) {
      var hash = crc.crc32(file.path + (file.stat ? file.stat.mtime : '')).toString(16)
      return relative(file.path) + '_' + hash
    }
  }

  function escape(val) { return val.replace(/\\|\/|\./g,'_') }
}


