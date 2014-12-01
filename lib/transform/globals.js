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

    if (!config.requireProcess && processEnvPattern.test(file.contents)) {
      config.requireProcess = true
      debug('Attaching process global')
    }

    this.push(file)
    next()
  })
}

