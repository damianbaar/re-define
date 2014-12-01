var through = require('through2')
  , format = require('util').format
  , debug = require('debug')('re-define:transform:has-process')

var processEnvPattern = /\bprocess\.env\b/

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull()) {
      this.push(file)
      next()
      return
    }

    if (!config.hasProcess && processEnvPattern.test(file.contents)) {
      config.hasProcess = true
      debug('process.env defined, for: ', file.path, file.requiredAs)
    }

    this.push(file)
    next()
  })
}

