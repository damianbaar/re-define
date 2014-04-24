#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , resolve = fs.resolve
  , read = function(path) { return fs.readFileSync(path, 'utf-8') }
  , resolve = require('path').resolve
  , _ = require('underscore')
  , colors = require('colors')
  , config = require('../lib/config')
  , redefine = require('../lib/index')

  program
    .option('-v, --verbose', 'Verbose mode')
    .option('-c, --config [name]', 'Re-define config')
    .option('-i, --input [code/file]', 'Arbitrary code')
    .option('-w, --wrapper [iife/empty]', 'Wrapper type')
    .option('-b, --base [dir]', 'Base folder for project')
    .option('-m, --main [file]', 'Main file')
    .option('-o, --output [file]', 'Output')
    .parse(process.argv)

  var input = program.input && resolveInput(program.input)
    , userConfig = program.config && resolveConfig(program.config) || {}

  if(program.wrapper) userConfig.wrapper = program.wrapper
  if(program.base)    userConfig.base = program.base
  if(program.main)    userConfig.main = program.main
  if(program.output)  userConfig.output = program.output
  if(program.verbose)  userConfig.verbose = program.verbose

  userConfig = config(userConfig)

  if(input) redefine.stream(userConfig, input, done)
  if(userConfig.base && userConfig.main) redefine.files(userConfig, done)

  function done(result) {
    if(userConfig.verbose) {
      var details = _.map(result.details, function(d) { return _.omit(d, "converter", "content") })
      console.log('\n----- RESULT ------\n'.green)
      console.log('DETAILS\n'.grey)
      console.log(details)
      console.log('\nCODE\n'.grey)
      console.log(result.code)
      console.log('\n------------'.green)
    }

    if(userConfig.output) {
      fs.writeFileSync(resolve(userConfig.output), result.code)
    }
  }

  function resolveConfig(config) {
    return isFile(config)
            ? JSON.parse(read(resolve(config)))
            : {}
  }

  function resolveInput(input) {
    var path = resolve(input)
    return isFile(input) ? read(path) : input
  }

  function isFile(path) {
    var stats = fs.lstatSync
      , exists = fs.existsSync

    return path
           && exists(path)
           && stats(path).isFile()
  }