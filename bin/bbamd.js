#!/usr/bin/env node

var program = require('commander')
  , bbamd = require('bbamd')
  , config = {}

program
  .option('-r, --root [value]', 'project root')
  .option('-o, --out [value]', 'output')
  .option('-s, --src [value]', 'main requirejs file')
  .parse(process.argv);

if(program.root) config.baseUrl = program.root
if(program.out) config.out = program.out
if(program.src) config.name = program.src

console.log("base url for project:", program.root)
console.log("output file:", program.out)
console.log("requirejs main file:", program.src)

if(!(program.root && program.out && program.src)) process.exit()

console.log("\n")

bbamd.convert(config)

console.log("Check your output file", program.out)
