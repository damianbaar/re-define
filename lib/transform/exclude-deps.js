var _ = require('lodash')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    //TODO if deps.length != params.length
    module.deps = _.chain(module.deps)
      .map(function(d) {
        return _.some(config.excludeDeps, function(p) { return new RegExp(p).test(d) })
                ? null 
                : d
      })
      .compact()
      .value()

    this.push(module)
    next()
  })
}
