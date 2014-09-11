#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , File = require('vinyl')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')

  program
    .option('-t, --transform [libs]'      , 'Attach transform stream', toArray)
    .option('-m, --main [filepath]'       , 'Main file')
    .option('-b, --base [dir]'            , 'CWD')
    .option('-d, --discoverable [dirs]'   , 'Folders to check when file not found in scope', toArray)
    .option('-e, --external [json]'       , 'External modules', JSON.parse)
    .option('-g, --globals [module#as]'   , 'Map externals to global - jquery#this.jquery', toArray)
    .option('-w, --wrapper [type]'        , 'Wrapper type umd')
    .option('-n, --names [json]'          , 'Register names for AMD/Global, i.e {amd:"sth",global:"sth.sth"}', JSON.parse)
    .option('-r, --returns [module]'      , 'Return module')
    .option('-s, --skip [module]'         , 'Skip external module', toArray)
    .option('-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"', toArray)
    .parse(process.argv)

  var options = 
    { base           : program.base
    , entries        : program.entries
    , wrapper        : program.wrapper
    , returns        : program.returns
    , names          : program.names
    , excludeDepsRef : program.excludeDepsRef
    , globals        : program.globals
    }

  config = redefine.config(options)

  if(program.args.length > 0)  config.entries = toArray(program.args[0])

  //CUSTOM TRANSFORMS
  var findExternal = require('re-define-include-external')({
      external     : program.external || {}
    , discoverable : program.discoverable || config.discoverable
    , descriptors  : program.descriptors || config.descriptors
    , skip         : program.skip
    })

  if(fs.existsSync(path.resolve(process.cwd(), 're-define.json'))) {
     var confFile = JSON.parse(fs.readFileSync('./re-define.json'))
     config = _.merge(config, confFile)
  }

  var bundle = redefine.bundle(config, (program.transform || []).concat([findExternal]))

  bundle.pipe(through.obj(function(file, enc, next) {
    console.log(file)
  }, function(end) {
    console.log('end')
  })).pipe(process.stdout)

  _.each(config.entries, function(e) {
    bundle.write(new File({path: e, cwd: config.base}))
  })

  function toArray(val) { return _.map(val.split(','), function(d) { return d.replace(/\ /g, '') }) }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
