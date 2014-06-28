#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , combiner = require('stream-combiner')
  , gs = require('glob-stream')
  , debug = require('debug')('re-define:bin')
  , through = require('through2')
  , fs = require('fs')

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

function DuplexThrough(options) {
  var convert
    , find 
    , stream
    , data = []

  var File = require('vinyl')

  convert = through(options, function(chunk, enc, cb) {
    this.push(chunk)
    cb()
  })

  convert
    .pipe(through(options, function(path, enc, next) {
      fs.createReadStream(path)
        .pipe(through(function(content, enc, done) {
          this.push(new File({path: path, contents: content }))
          next()
        }.bind(this)))
    }))
    .pipe(through(options, function(file, enc, cb) {
      if(_.pluck(data, 'path').indexOf(file.path) > -1) {
        this.push(null)
        cb()
        return
      }
      
      //write missing dependencies
      convert.write('./umd.js')

      this.push(file)
      cb()
    }, function(end) {
      console.log('end')
    }))
    .pipe(through(options, function(chunk, enc, cb) {
      data.push(chunk)
      cb()
    }, function(end) {
      stream.end()
      end()
    }))

  stream = through(options, function(chunk, enc, next) {
    convert.write(_.has(chunk, 'path') ? chunk.path : chunk.toString())
    next()
  }, function(end) {
    this.push(_.pluck(data, 'contents').toString())
    end()
  })

  return stream
}

var duplex = DuplexThrough({objectMode: true})
//wrapper
// source.pipe(duplex).pipe(process.stdout)
duplex.pipe(process.stdout)

duplex.write('./main.js')

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
