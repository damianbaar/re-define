#!/usr/bin/env node 

var program     = require('commander')
  , _           = require('underscore')
  , fs          = require('fs')
  , resolvePath = require('path').resolve
  , readFile    = _.compose(_.partial(fs.readFileSync, _, 'utf-8'), resolvePath)
  , readStream  = _.compose(fs.createReadStream, resolvePath)
  , writeStream = _.compose(fs.createWriteStream, resolvePath)
  , redefine    = require('../lib/index')

  program
    .option('-v , --verbose'       , 'Verbose mode')
    .option('-c , --config [name]' , 'Re-define config')
    .option('-w , --wrapper [type]', 'Wrapper type iife, empty , umd')
    .option('-b , --base [dir]'    , 'Base folder for project')
    .option('-m , --main [file]'   , 'Main file')
    .option('-o , --output [file]' , 'Output')
    .option('-s , --stream'        , 'Whether should read from stream')
    .option('--separator [value]'  , 'Module separator while reading from stream')
    .parse(process.argv)

  var userConfig = program.config && JSON.parse(readFile(program.config)) || {}

  if(program.base)    userConfig.base    = program.base
  if(program.main)    userConfig.main    = program.main
  if(program.output)  userConfig.output  = program.output
  if(program.verbose) userConfig.verbose = program.verbose
  if(program.wrapper) userConfig.wrapper = program.wrapper
  if(program.separator) userConfig.separator = program.separator

  var source = program.stream ? process.stdin : readStream(userConfig.main)
    , output = userConfig.output ? writeStream(userConfig.output) : process.stdout
    , config = redefine.config(userConfig)

  source
    .pipe(redefine.convert(config))
    .pipe(output)
