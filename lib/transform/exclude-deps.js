var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:exclude-deps')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    var deps = module.deps
      , params = module.params

    var toRemove = _.chain(module.deps)
      .map(function(d, i) {
        return _.some(config.excludeDeps, function(p) { return new RegExp(p).test(d) })
                ? {dep: d, idx: i}
                : null
      })
      .compact()
      .value()

    if(toRemove.length === 0) {
      this.push(module)
      next()
      return
    }

    if(params && deps && deps.length >= params.length) {
      var hasRef = _.map(toRemove.reverse().slice(deps.length - params.length), function(d) { return d.idx })
      module.params = _.filter(module.params, function(d, i) { return hasRef.indexOf(i) === -1 })
      module.deps = _.difference(module.deps, _.map(toRemove, function(d) { return d.dep }))
    }

    debug('diff %s', _.difference(deps, module.deps))

    this.push(module)
    next()
  })
}
