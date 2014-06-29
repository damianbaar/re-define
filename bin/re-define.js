#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , combiner = require('stream-combiner')
  , gs = require('glob-stream')
  , debug = require('debug')('re-define:bin')
  , through = require('through2')
  , fs = require('fs')
  , path = require('path')
  , File = require('vinyl')

  program
    .option('-c, --config [name]'         , 'Re-define config')
    .option('-w, --wrapper [type]'        , 'Wrapper type report, iife, empty , umd')
    .option('-b, --base [dir]'            , 'Base folder for project')
    .option('-n, --name [module]'         , 'Module name')
    .option('-r, --return [module]'       , 'Export module')
    .option('-m, --map [module#as]'       , 'Map externals to global - jquery#this.jquery', toArray)
    .option('-i, --include [filePath#as]' , 'Include external file, filepath#external_dep', toArray)
    .option('-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"', toArray)
    .option('-f, --file-filter'           , 'Glob pattern for files and folders')
    .parse(process.argv)

  var config = {}

  var options = 
    { base           : program.base
    , separator      : program.separator
    , wrapper        : program.wrapper
    , return         : program.return
    , name           : program.name
    , excludeDeps    : program.excludeDeps
    , map            : program.map
    , debug          : program.debug
    , include        : program.include
    }

  config = redefine.config(_.defaults(options, config))

  if(program.args.length === 1) 
    config.fileFilter = program.fileFilter || toArray(program.args[0])

  var source

  debug('starting re-define')
  debug(!process.stdin.isTTY ? 'reading data from pipe' : 'traversing dirs')

  if(!process.stdin.isTTY) {
    process.stdin.setEncoding('utf-8')
    source = combiner(process.stdin, redefine.split())
  }
  else 
    source = gs.create(config.fileFilter, {cwd: config.base})

function define(options) {
  var converter
    , stream
    , processing = []
    , pending = []
    , data = []
    , external = []

  converter = through(options, function(file, enc, next) {
      if(processing.indexOf(file.path) > -1) {
        next()
        return
      }

      processing.push(file.path)
      pending.push(file.path)

      this.push(file)
      next()
    })

  converter
    .pipe(through(options, function(file, enc, next) {
      if (file.isNull()) {
        var read = fs.createReadStream(file.path)
                     .on('error', function(e) { console.log(e) })

        file.contents = read
      }

      if (file.isBuffer()) next()
      if (file.isStream()) {
        file.pipe(through(function(content) {
          file.contents = content
          this.push(file)
          next()
        }.bind(this)))
      }
    }))
    .pipe(redefine.transform.convert(config))
    .pipe(redefine.transform.excludeDeps(config))
    .pipe(redefine.transform.rewriteDeps(config))
    .pipe(through(options, function(file, enc, next) {
      var that = this
        , depLen = file.deps.length

      if(depLen === 0) {
        this.push(file)
        next()
      }

      _.each(file.deps, function(d, i) {
        d.path = path.relative(file.base, path.resolve(path.dirname(file.path), d.path))

        fs.exists(d.path, function(exists) {
          if(!exists) {
            d.path = d.name
            _.pluck(external, 'name').indexOf(d.name) === -1 && external.push(d)
          }
          else stream.write(new File(_.extend(d, { base: file.base })))

          if(depLen === i + 1) {
            that.push(file)
            next()
          }
        })
      })
    }))
    .pipe(through(options, function(chunk, enc, next) {
      var idx = pending.indexOf(chunk.path)
      if(idx > -1) pending.splice(idx, 1)

      data.push(chunk)

      if(!pending.length) {
        converter.end()
        stream.end()
      }
      next()
    }))

  stream = through(options, function(chunk, enc, next) {
    converter.write(chunk)
    next()
  }, function(end) {
    this.push('----->' + _.pluck(data, 'relative', 'exists').toString())
    end()
  })

  return stream
}

var duplex = define({objectMode: true})
//wrapper
// source.pipe(duplex).pipe(process.stdout)
duplex.pipe(process.stdout)

duplex.write(new File({path: './main.js'}))

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
