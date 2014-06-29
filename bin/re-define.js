#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , debug = require('debug')('re-define:bin')

  program
    .option('-t, --transform'             , 'Attach transform stream')
    .option('-m, --main [filepath]'       , 'Main file')
    .option('-b, --base [dir]'            , 'CWD')
    .option('-e, --external [json]'       , 'External modules', JSON.parse)
    .option('-g, --glob [module#as]'       , 'Map externals to global - jquery#this.jquery', toArray)

    .option('-w, --wrapper [type]'        , 'Wrapper type report, iife, empty , umd')
    .option('-n, --name [module]'         , 'Module name')
    .option('-r, --returns [module]'      , 'Return module')
    .option('-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"', toArray)
    .parse(process.argv)

  var config = {}

  var options = 
    { base           : program.base
    , main           : program.main
    , wrapper        : program.wrapper
    , returns        : program.returns
    , name           : program.name
    , excludeDeps    : program.excludeDeps
    , glob           : program.glob
    }

  config = redefine.config(_.defaults(options, config))

  if(program.args.length === 1)  config.main = program.args[0]

  debug('starting re-define')

  var re = redefine.start(config)

  re.pipe(process.stdout)

  re.write(config.main)

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
