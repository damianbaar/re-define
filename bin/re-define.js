#!/usr/bin/env node

var program = require('commander')
  , _ = require('underscore')
  , fs = require('fs')
  , readFile = _.partial(fs.readFileSync, _, 'utf-8')
  , readStream = fs.createReadStream
  , writeStream = fs.createWriteStream
  , resolvePath = require('path').resolve
  , redefine = require('../lib/index')

  program
    .option('-v , --verbose'       , 'Verbose mode')
    .option('-c , --config [name]' , 'Re-define config')
    .option('-w , --wrapper [type]', 'Wrapper type iife, empty , umd')
    .option('-b , --base [dir]'    , 'Base folder for project')
    .option('-m , --main [file]'   , 'Main file')
    .option('-o , --output [file]' , 'Output')
    .option('-f , --follow [value]', 'Whether should resolve whole dep tree')
    .option('-s , --stream'        , 'Whether should read from stream')
    .parse(process.argv)

  var userConfig = program.config && JSON.parse(readFile(resolvePath(program.config))) || {}

  if(program.base)    userConfig.base    = program.base
  if(program.main)    userConfig.main    = program.main
  if(program.output)  userConfig.output  = program.output
  if(program.follow)  userConfig.follow  = program.follow && program.follow === 'true'
  if(program.verbose) userConfig.verbose = program.verbose
  if(program.wrapper) userConfig.wrapper = program.wrapper

  var source = program.stream ? process.stdin : readStream(resolve(userConfig.main))
    , output = userConfig.output ? writeStream(resolve(userConfig.output)) : process.stdout
    , config = redefine.config(userConfig)

  source
    .pipe(redefine.convert(config))
    .pipe(output)
