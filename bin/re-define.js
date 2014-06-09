#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , config = {}

  program
    .option('-c, --config [name]'          , 'Re-define config')
    .option('-w, --wrapper [type]'         , 'Wrapper type iife, empty , umd')
    .option('-b, --base [dir]'             , 'Base folder for project')
    .option('-n, --name [module]'          , 'AMD module name')
    .option('-r, --return [module]'        , 'Export module')
    .option('    --content'                , 'Whether streamed content is a file content')
    .option('-i, --include [file#as]'      , 'Include external files', toArray)
    .option('-f, --skip-folders [folders]' , 'Ignore folders - a,b,c,d', toArray)
    .option('-d, --skip-deps [deps]'       , 'Ignore deps - ".css"', toArray)
    .option('-m, --map [module#as]'        , 'Map externals to global - jquery#this.jquery', toArray)
    .parse(process.argv)

  if(program.args.length === 1 || program.config) 
    config = loadConfig(program.args[0] || program.config)

  var options = 
    { base        : program.base
    , separator : program.separator 
    , wrapper     : program.wrapper
    , return      : program.return
    , name        : program.name
    , includeType : program.includeType
    , includeFile : program.includeFile
    , excludeFolder : program.skipFolders
    , excludeFile : program.excludeFile
    , excludeDep : program.excludeDep
    , external    : program.external
    }

  var config = redefine.config(_.defaults(options, config))
    , source = !process.stdin.isTTY ? process.stdin : require('./transform/traverse-dir')(config)
    , transform = program.content ? redefine.fromContent(config) : redefine.fromPath(config)
    , output = process.stdout

  if(process.stdin.isTTY) source.open()
  else source.setEncoding('utf-8')

  source
    .pipe(transform)
    .pipe(output)

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
