#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , resolve = fs.resolve
  , read = function(path) { return fs.readFileSync(path, 'utf-8') }
  , readStream = fs.createReadStream
  , writeStream = fs.createWriteStream
  , resolve = require('path').resolve
  , config = require('../lib/config')
  , redefine = require('../lib/index')

  program
    .option('-v, --verbose', 'Verbose mode')
    .option('-c, --config [name]', 'Re-define config')
    .option('-w, --wrapper [type]', 'Wrapper type iife, empty, umd')
    .option('-b, --base [dir]', 'Base folder for project')
    .option('-m, --main [file]', 'Main file')
    .option('-o, --output [file]', 'Output')
    .option('-f, --follow [value]', 'Whether should resolve whole dep tree')
    .option('-s, --stream', 'Whether should read from stream')
    .parse(process.argv)

  var userConfig = program.config && JSON.parse(read(resolve(program.config))) || {}

  if(program.wrapper) userConfig.wrapper = program.wrapper
  if(program.base)    userConfig.base    = program.base
  if(program.main)    userConfig.main    = program.main
  if(program.output)  userConfig.output  = program.output
  if(program.verbose) userConfig.verbose = program.verbose
  if(program.follow)  userConfig.follow  = program.follow && program.follow =  =  = 'true'

  var source = program.stream ? process.stdin : readStream(resolve(userConfig.main))

  source
     .pipe(redefine.convert(userConfig))
     .pipe(userConfig.output ? writeStream(resolve(userConfig.output)) : process.stdout)
