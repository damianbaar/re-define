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
    .option('-w, --wrapper [iife/empty]', 'Wrapper type')
    .option('-b, --base [dir]', 'Base folder for project')
    .option('-m, --main [file]', 'Main file')
    .option('-o, --output [file]', 'Output')
    .option('-f, --follow [value]', 'Whether should resolve whole dep tree')
    .parse(process.argv)

  var userConfig = program.config && JSON.parse(read(resolve(program.config))) || {}

  if(program.wrapper) userConfig.wrapper = program.wrapper
  if(program.base)    userConfig.base = program.base
  if(program.main)    userConfig.main = program.main
  if(program.output)  userConfig.output = program.output
  if(program.verbose) userConfig.verbose = program.verbose
  if(program.follow)  userConfig.follow = program.follow && program.follow === 'true'

  userConfig = config(userConfig)

  // process.stdin
  //        .pipe(redefine(userConfig))
  //        .pipe(process.stdout)

  if(userConfig.main)
    readStream(resolve(userConfig.main))
      .pipe(redefine(userConfig))
      .pipe(userConfig.out ? writeStream(resolve(userConfig.out)) : process.stdout)
      .on('end', function () { console.log('done') })