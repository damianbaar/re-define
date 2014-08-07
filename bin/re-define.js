#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , File = require('vinyl')

  program
    .option('-t, --transform [libs]'      , 'Attach transform stream', toArray)
    .option('-m, --main [filepath]'       , 'Main file')
    .option('-b, --base [dir]'            , 'CWD')
    .option('-d, --discoverable [dirs]'   , 'Folders to check when file not found in scope', toArray)
    .option('-e, --external [json]'       , 'External modules', JSON.parse)
    .option('-g, --globals [module#as]'   , 'Map externals to global - jquery#this.jquery', toArray)
    .option('-w, --wrapper [type]'        , 'Wrapper type report, iife, empty , umd')
    .option('-n, --name [module]'         , 'Module name')
    .option('-r, --returns [module]'      , 'Return module')
    .option('-s, --skip [module]'         , 'Skip external module', toArray)
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
    , globals        : program.globals
    }

  config = redefine.config(_.defaults(options, config))

  if(program.args.length > 0)  config.main = program.args[0]

  //CUSTOM TRANSFORMS
  var findExternal = require('../lib/transform/find-external')({
      external     : program.external || []
    , discoverable : program.discoverable || ['node_modules', 'bower_component']
    , descriptors  : program.descriptors || ['package.json', 'bower.json']
    , skip         : program.skip
    })

  var bundle = redefine.bundle(config, (program.transform || []).concat([findExternal]))

  bundle.pipe(process.stdout)

  bundle.write(new File({path: config.main, cwd: config.base}))

  function toArray(val) { return val.split(',') }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
