var through = require('through2')
  , debug = require('debug')('re-define:transform:concat-modules')

module.exports = function(config) {
  var stream = through.obj(write, end)
    , modules = []

  function write (module, enc, next) {
    debug('concat stream "%s"', module.name)
    modules.push(module)
    next() 
  }
  function end (cb) {
    this.push(modules)
    cb()
  }

  return stream
}
