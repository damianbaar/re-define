var through = require('through2')
  , format = require('util').format
  , debug = require('debug')('re-define:transform:has-process')

var processEnvPattern = /\bprocess\.env\b/
  , definePattern = /\bdefine(\ )?\(/
  , __filenamePattern = /\b__filename\b/
  , __dirnamePattern = /\b__dirname\b/

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull()) {
      this.push(file)
      next()
      return
    }

    var props = file.properties = file.properties || {}

    if (processEnvPattern.test(file.contents)) {
      props.process = true
      debug('Attaching process to file', file.name)
    }

    if (definePattern.test(file.contents)) {
      props.define = true
      debug('Attaching define to file', file.name)
    }

    if (__filenamePattern.test(file.contents)) {
      props.__filename = true
      debug('Attaching __filename to file', file.name)
    }

    if (__dirnamePattern.test(file.contents)) {
      props.__dirname = true
      debug('Attaching __dirname to file', file.name)
    }

    this.push(file)
    next()
  })
}

