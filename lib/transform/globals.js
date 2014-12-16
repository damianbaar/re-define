var through = require('through2')
  , format = require('util').format
  , debug = require('debug')('re-define:transform:has-process')

var processEnvPattern = /\bprocess\.env\b/
var definePattern = /\bdefine(\ )?\(/

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull()) {
      this.push(file)
      next()
      return
    }

    file.use = {} 

    if (processEnvPattern.test(file.contents)) {
      file.use.process = true
      debug('Attaching process to file', file.name)
    }

    if (definePattern.test(file.contents)) {
      file.use.define = true
      debug('Attaching define to file', file.name)
    }

    this.push(file)
    next()
  })
}

