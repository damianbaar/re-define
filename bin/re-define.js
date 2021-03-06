#!/usr/bin/env node 

var program = require('commander')
  , _ = require('lodash')
  , redefine = require('../lib/index')
  , File = require('vinyl')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , mkdirp = require('mkdirp')
  , glob = require('glob')

  program
    .option('--cwd [dir]'                 , 'CWD')
    .option('-b, --base [dir]'            , 'Base dir')
    .option('-o, --output [dir or file]'  , 'Output, when defined saving to appropriate files')
    .option('-t, --transforms [libs]'     , 'Attach transform stream', toArray)

    .option('-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"', toArray)
    .option('-m, --map-deps [deps]'       , 'Remap dependency name (require call)', JSON.parse)
    .option('--namespace [a.b.c.d]'       , 'Namespace for bundle')
    .option('--imports [namespaces]'      , 'Import namespaces', toArray)

    .option('-g, --globals [json]'        , 'Map externals to global - {jquery:this.jquery}', JSON.parse)
    .option('-n, --names [json]'          , 'Register names for AMD/Global, i.e {amd:"sth",global:"sth.sth"}', JSON.parse)
    .option('-r, --returns [file/module]' , 'Return module, could be specified as file or resolved module')
    .option('-w, --wrapper [type]'        , 'Wrapper type umd')
    .option('-p, --project-name [name]'   , 'Project name')

    .option('--external [json]'       , 'Include module from external location', JSON.parse)
    .option('--discoverable [dirs]'   , 'External modules lib, such bower_components', toArray)
    .option('--descriptors [files]'   , 'Checking main file in external dep', toArray)
    .option('--skip [modules]'        , 'Do not include specified dependency and mark as dependency', toArray)
    .option('--exclude [modules]'     , 'Do not include and do not specify as dependency', toArray)
    .option('--empty [modules]'       , 'Make modules empty', toArray)

    .option('--development'           , 'Development mode')

    .parse(process.argv)

  var options = 
    { base           : program.base
    , cwd            : program.cwd
    , output         : program.output
    , map            : program.mapDeps
    , wrapper        : program.wrapper
    , returns        : program.returns
    , imports        : program.imports
    , namespace      : program.namespace
    , names          : program.names
    , globals        : program.globals
    , project        : program.projectName
    , development    : !!program.development
    , discoverable   : program.discoverable
    , exclude        : program.exclude
    }

  config = redefine.config(options)

  if(program.args.length > 0)  {
    var files = program.args[0]

    if(files.indexOf(',') > -1) config.entries = toArray(files)
    else config.entries = glob.sync(files)
  }

  var findExternal = require('re-define-include-external')({
      external     : program.external
    , discoverable : program.discoverable
    , descriptors  : program.descriptors
    , skip         : program.skip
    })

  if(fs.existsSync(path.resolve(process.cwd(), 're-define.json'))) {
     var confFile = JSON.parse(fs.readFileSync('./re-define.json'))
     config = _.merge(config, confFile)

     config.slice = confFile.slice || config.slice
  }

  var bundle = redefine.bundle(config, (program.transforms || []).concat([findExternal]))

  bundle
  .pipe(through.obj(function(file, enc, next) {
    if(_.keys(config.slice).length > 1) {
      saveFile(file)
      this.unpipe(process.stdout)
    } else {
      if(config.output) {
        file.path = config.output
        saveFile(file)
        this.unpipe(process.stdout)
      }
      else this.push(file.contents)
    }

    next()
  }))
  .pipe(process.stdout)

  function saveFile(file, cb) {
    mkdirp(path.dirname(file.path), function (err) {
      if (err) return cb(err)
      fs.writeFile(file.path, file.contents, cb)
    })
  }

  _.each(config.entries, function(e) {
    bundle.write(new File({ path: e }))
  })

  function toArray(val) { return _.map(val.split(','), function(d) { return d.replace(/\ /g, '') }) }

  function loadConfig(configPath) {
    return require('fs').readFileSync(require('path').resolve(configPath), 'utf-8')
  }
