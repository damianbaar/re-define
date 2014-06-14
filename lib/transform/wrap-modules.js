var through = require('through2')

module.exports = function(config) {
  return through.obj(function(modules, enc, next) {
    this.push(config.wrappers[ config.wrapper ](modules.internal, modules.external, config))
    next()
  })
}
