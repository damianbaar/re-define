var through = require('through2')

module.exports = function(config) {
  var stream = through.obj(write, end)
    , modules = []

  function write (buf, enc, next) {
    modules.push(buf)
    next() 
  }
  function end (cb) {
    this.push(modules)
    cb()
  }

  return stream
}
