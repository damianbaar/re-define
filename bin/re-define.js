#!/usr/bin/env node 

var program     = require('commander')
  , _           = require('underscore')
  , fs          = require('fs')
  , path        = require('path')
  , finder      = require('findit')
  , readFile    = _.compose(_.partial(fs.readFileSync, _, 'utf-8'), path.resolve)
  , readStream  = _.compose(fs.createReadStream, path.resolve)
  , writeStream = _.compose(fs.createWriteStream, path.resolve)
  , stdin       = process.stdin
  , through     = require('through2')
  , redefine    = require('../lib/index')

  program
    .option('-c  , --config [name]'          , 'Re-define config')
    .option('-w  , --wrapper [type]'         , 'Wrapper type iife, empty , umd')
    .option('-b  , --base [dir]'             , 'Base folder for project')
    .option('-n  , --name [module name]'     , 'AMD module name')
    .option('-e  , --export [module name]'   , 'Export')
    .option('-r  , --report'                 , 'Bundle overview')
    .option('-sf , --skip-folders [folders]' , 'Ignore folders i.e. a, b, c, d')
    .option('-sd , --skip-deps [deps]'       , 'Ignore folders i.e. ".css"')
    .parse(process.argv)

  var config = program.config

  if(!config && program.args.length === 1) config = program.args[0]

  var userConfig = config && JSON.parse(readFile(config || program.config)) || {}

  if(program.base)    userConfig.base    = program.base
  if(program.wrapper) userConfig.wrapper = program.wrapper
  if(program.report)  userConfig.wrapper = program.report ? 'report' : userConfig.wrapper

  if(program.export) userConfig.exports = program.export
  if(program.name)   userConfig.name    = program.name

  if(program.skipFolders) userConfig.skipFolders = program.skipFolders.split(',')
  if(program.skipDeps)    userConfig.skipDeps  = program.skipDeps.split(',')

  var source = !stdin.isTTY ? process.stdin : through()
    , output = process.stdout
    , config = redefine.config(userConfig)

  if(!!stdin.isTTY) {
    source.write('READY STEADY GO!')
    source.end()
  }

  var split = through.obj(function(chunk, enc, next) {
      _.each(chunk.split('\n'), function(p) {
        if(fs.statSync(path.resolve(p)).isFile()){
          this.push({path: path.resolve(p)})
        }
      }.bind(this))

      next()
    })

  //bower_components
  //node_modules -> remove to make structure flat
  var traverseDir = through.obj(function(chunk, enc, next) {
    var ignoredFolders = config.skipFolders
      , includedFiles  = config.includeTypes

    finder(path.resolve(config.base))
      .on('directory', function (dir, stat, stop) {
        ignoreDir(dir) && stop()
      })
      .on("file", function (file, stat) {
        includeFile(file) && this.push({path: file})
      }.bind(this))
      .on('end', function() {
        next()
      })

    function ignoreDir(dir) { return ignoredFolders.indexOf(path.basename(dir)) > -1 }
    function includeFile(file) { return includedFiles.indexOf(path.extname(file)) > -1 }
  })

  source.setEncoding('utf-8')

  source
    .pipe(!!stdin.isTTY ? traverseDir : split)
    .pipe(redefine.convert(config))
    .pipe(output)
