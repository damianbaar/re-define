#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , combiner = require('stream-combiner')

  program
    .option('-c, --config [name]'         , 'Re-define config')
    .option('-w, --wrapper [type]'        , 'Wrapper type iife, empty , umd')
    .option('-b, --base [dir]'            , 'Base folder for project')
    .option('-n, --name [module]'         , 'AMD module name')
    .option('-r, --return [module]'       , 'Export module')
    .option('--debug'                     , 'Debug mode, creating re-define.log file')
    .option('--include-files [file#as]'   , 'Include external files', toArray)
    .option('--exclude-folders [folders]' , 'Ignore folders - a,b,c,d', toArray)
    .option('--exclude-deps [deps]'       , 'Ignore deps - ".css"', toArray)
    .option('--externals [module#as]'     , 'Map externals to global - jquery#this.jquery', toArray)
    .parse(process.argv)

  var config = {}

  if(program.args.length === 1 || program.config) 
    config = loadConfig(program.args[0] || program.config)

  var options = 
    { base          : program.base
    , separator     : program.separator
    , wrapper       : program.wrapper
    , return        : program.return
    , name          : program.name
    , includeType   : program.includeType
    , includeFile   : program.includeFile
    , excludeFolder : program.skipFolders
    , excludeFile   : program.excludeFile
    , excludeDep    : program.excludeDep
    , externals     : program.externals
    , debug         : program.debug
    }
  
  config = redefine.config(_.defaults(options, config))

  var source

  if(!process.stdin.isTTY) {
    process.stdin.setEncoding('utf-8')
    source = combiner(process.stdin, redefine.split())
  }
  else 
    source = redefine.findit(config)

  source
    .pipe(redefine.fromPath(config))
    .pipe(process.stdout)

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
