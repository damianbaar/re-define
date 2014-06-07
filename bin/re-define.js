#!/usr/bin/env node 

var program     = require('commander')
  , _           = require('underscore')
  , fs          = require('fs')
  , resolvePath = require('path').resolve
  , readFile    = _.compose(_.partial(fs.readFileSync, _, 'utf-8'), resolvePath)
  , readStream  = _.compose(fs.createReadStream, resolvePath)
  , writeStream = _.compose(fs.createWriteStream, resolvePath)
  , stdin       = process.stdin
  , through     = require('through2')
  , redefine    = require('../lib/index')

  program
    .option('-c, --config [name]'      , 'Re-define config')
    .option('-w, --wrapper [type]'     , 'Wrapper type iife, empty , umd')
    .option('-b, --base [dir]'         , 'Base folder for project')
    .option('-e, --export [module name]'        , 'Export')
    .option('-r, --report'             , 'Bundle overview')
    .option('-d, --debug'              , 'Debug mode creates re-define.log file')
    .parse(process.argv)

  var config = program.config

  if(!config && program.args.length === 1) config = program.args[0]

  var userConfig = config && JSON.parse(readFile(config || program.config)) || {}

  if(program.base)      userConfig.base      = program.base
  if(program.wrapper)   userConfig.wrapper   = program.wrapper
  if(program.report)    userConfig.wrapper   = program.report ? 'report' : userConfig.wrapper
  if(program.export)   userConfig.exports    = program.export

  var source = !stdin.isTTY ? process.stdin : through()
    , output = process.stdout
    , config = redefine.config(stdin.isTTY, userConfig)

  if(!!stdin.isTTY) {
    source.write('fake')
    source.end()
  }

  source.setEncoding('utf-8')

  source
    .pipe(redefine.convert(config))
    .pipe(output)
