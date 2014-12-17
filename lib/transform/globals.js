var through = require('through2')
  , format = require('util').format
  , debug = require('debug')('re-define:transform:has-process')
  , path = require('path')

var processEnvPattern = /\bprocess\.env\b/
  , definePattern = /\bdefine(\ )?\(/
  , __filenamePattern = /\b__filename\b/
  , __dirnamePattern = /\b__dirname\b/

module.exports = function (config) {
  return through.obj(function(file, enc, next) {
    if(file.isNull()) {
      this.push(file)
      next()
      return
    }

    var props = file.properties = file.properties || {}
      , _globals = config._globals || {}

    if (processEnvPattern.test(file.contents)) {
      props.process = _globals.process || 'window ? {env: {}} : process'
      debug('Attaching process to file', file.name)
    }

    if (definePattern.test(file.contents)) {
      props.define = _globals.define || 'null'
      debug('Attaching define to file', file.name)
    }

    //TODO attach this one which is needed
    if (__dirnamePattern.test(file.contents) || __filenamePattern.test(file.contents)) {
      var cwd = (config.cwd && path.resolve(config.cwd)) || process.cwd()
        , base = path.join(cwd, config.base)
        , filepath = path.relative(base, file.path)
        , dir = path.dirname(filepath)

      props.__filename = '"' + path.basename(escape(filepath)) + '"'
      props.__dirname  =  '"' + path.join(escape(dir)) + '"'

      debug('Attaching __filename, __dirnam to file', file.name)

      function escape(val) { return val.replace(/\\\\|\\/g, '/') }
    }

    this.push(file)
    next()
  })
}

