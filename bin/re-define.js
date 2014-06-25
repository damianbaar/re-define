#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , combiner = require('stream-combiner')
  , gs = require('glob-stream')
  , debug = require('debug')('re-define:bin')
  , through = require('through2')

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
    , added = false

  convert = through(options, function(chunk, enc, cb) {
    console.log('convert', chunk)
    data.push(chunk)
    this.push(data)
    cb()
  }, function(cb) {
    console.log('convert','end')
    stream.end()
    cb()
  })


  convert
    .pipe(through(options, function(chunk, enc, cb) {
      console.log('pipe', chunk)
      this.push(chunk)
      cb()
    }))
    .pipe(through(options, function(chunk, enc, cb) {
      if(added) {
        this.push(null)
        return
      }
      stream.write('./main2.js')
      stream.write('./main2.js')
      cb()
      added = true
    }))
    .pipe(convert)

  stream = through(options, function(chunk, enc, next) {
    convert.write(chunk.toString())
    next()
  }, function(end) {
    this.push(data.toString())
    end()
  })

  return stream
}

var duplex = DuplexThrough({objectMode: true})
//wrapper
duplex.pipe(process.stdout)

duplex.write('./main.js')
duplex.write('./main.js')
duplex.write('./main.js')


  // source
  //   .pipe(redefine.fromPath(config))
  //   .pipe(process.stdout)

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
