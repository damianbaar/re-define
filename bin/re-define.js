#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , combiner = require('stream-combiner')
  , debug = require('debug')('re-define:bin')

  program
    .option('-t, --transform'             , 'Attach your own transform stream')
    .option('-i, --include [filePath#as]' , 'Include external file, filepath#external_dep', toArray)
    .option('-m, --main [filepath]', 'Main file')
    .option('-e, --external [json]'        , 'External modules', JSON.parse)
    .option('-b, --base [dir]'             , 'External modules')

    .option('-w, --wrapper [type]'        , 'Wrapper type report, iife, empty , umd')
    .option('-n, --name [module]'         , 'Module name')
    // .option('-m, --map [module#as]'       , 'Map externals to global - jquery#this.jquery', toArray)
    .option('-r, --return [module]'       , 'Export module')
    .option('-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"', toArray)
    .parse(process.argv)

  var config = {}

  var options = 
    { base           : program.base
    , main           : program.main
    , separator      : program.separator
    , wrapper        : program.wrapper
    , return         : program.return
    , name           : program.name
    , excludeDeps    : program.excludeDeps
    , map            : program.map
    , external       : program.external
    }

  config = redefine.config(_.defaults(options, config))

  if(program.args.length === 1) config.main = program.main

  var source

  debug('starting re-define')
  debug(!process.stdin.isTTY ? 'reading data from pipe' : 'traversing dirs')

  if(!process.stdin.isTTY) {
    process.stdin.setEncoding('utf-8')
    source = combiner(process.stdin, redefine.split())
  }

//wrapper
// source.pipe(duplex).pipe(process.stdout)

 var re = redefine.start(config)
        
re.pipe(process.stdout)
re.write(config.main)

function toArray(val) { return val.split(',') }

function loadConfig(configPath) {
  return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
}
