#!/usr/bin/env node --debug-brk

var program = require('commander')
  , reason = require('reason')
  , fs = require('fs')
  , resolve = fs.resolve
  , read = function(path) { return fs.readFileSync(path, 'utf-8') }
  , resolve = require('path').resolve

  program
    .option('-v, --verbose', 'Verbose mode')
    .option('-c, --config [name]', 'Config')
    .option('-i, --input [code/file]', 'Input')
    .parse(process.argv)

var input = resolveInput(program.input)
  , config = resolveConfig(program.config)
  , done = function(result) { console.log('end:', result) }

if(input) reason.convert(config, input, done)
if(config && !input) reason.bundle(config, done)

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