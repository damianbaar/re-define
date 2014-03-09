#!/usr/bin/env node 

var program = require('commander')
  , bbamd = require('../main')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , config = {}

  program
    .option('-r, --root [value]', 'project root')
    .option('-o, --out [value]', 'output')
    .option('-s, --src [value]', 'main requirejs file')
    .option('-c, --config [value]', 'custom config for requirejs/bbamd')
    .parse(process.argv);

  if(program.config){
    var customConfig = 
      fs.readFileSync(path.resolve(program.config), "utf-8")

    _(config).extend(JSON.parse(customConfig))
  } 
  
  if(program.root) config.baseUrl = program.root
  if(program.out) config.out = program.out
  if(program.src) config.name = program.src || "main"

  if(!(config.baseUrl && config.out && config.name)) {
    console.log("Good start!")
    console.log("To move forward, provide the config file.")
    process.exit()
  }

  console.log("Base url for project:", config.baseUrl)
  console.log("Output file:", config.out)
  console.log("RequireJS main file:", config.name)

  console.log("\n")

  bbamd.convert(config, function(content){
    console.log("Check your output file", config.out)
  })

