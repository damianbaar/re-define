#!/usr/bin/env node
//--debug-brk

var program = require('commander')
  , reason = require('reason')
  , fs = require('fs')
  , resolve = fs.resolve
  , read = function(path) { return fs.readFileSync(path, 'utf-8') }
  , config = require('../lib/config')
  , resolve = require('path').resolve

  program
    .option('-v, --verbose', 'Verbose mode')
    .option('-c, --config [name]', 'Config')
    .option('-i, --input [code/file]', 'Input')
    .option('-w, --wrapper [iife/empty]', 'Input')
    .parse(process.argv)

  var input = program.input && resolveInput(program.input)
    , userConfig = program.config && resolveConfig(program.config)
    , done = function(result) {
      console.log('\n----- RESULT ------\n', result, '\n------------')
    }

  if(program.wrapper) userConfig.wrapper = program.wrapper

  if(userConfig && !input) reason.convert.files(config(userConfig), done)
  if(input) reason.convert.stream(config(), input, done)

  function resolveConfig(config) {
    return isFile(config) ? JSON.parse(read(resolve(config)))
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