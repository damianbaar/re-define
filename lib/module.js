var util = require('util')
  , File = require('vinyl')

module.exports = Module

util.inherits(Module, File)

function Module(options) {
  if (!(this instanceof Module)) return new Module(options)

  File.call(this, options)
}

Module.prototype.canParse = function() {
  return /require|define.*\(.*['"]/m.test(this.contents)
}
