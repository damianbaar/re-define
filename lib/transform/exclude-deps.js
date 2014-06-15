var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:exclude-deps')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    var deps = module.deps
    //TODO if deps.length != params.length
    module.deps = _.chain(module.deps)
      .map(function(d) {
        return _.some(config.excludeDeps, function(p) { return new RegExp(p).test(d) })
                ? null 
                : d
      })
      .compact()
      .value()

    debug('diff %s', _.difference(deps, module.deps))

    this.push(module)
    next()
  })
}
