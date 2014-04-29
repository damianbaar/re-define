var async = require('async')
  , _ = require('underscore')

  module.exports = function(mixins, base) {
    return function(module, modules, done) {
      var toResolve = _.chain(module.deps)
                       .map(function(p) {
                         var m = _.find(mixins, function(m) { return m.pattern.test(p) })
                         return m && { resolver: m.resolver
                                     , ref: p
                                     , name: p.replace(m.pattern, '') }
                       })
                       .compact()
                       .map(function(m) {
                         return m.resolver( module.path || base, base, m.name, m.ref)
                       })
                       .each(function(m) {
                          module.deps = m.override(module.deps)
                       })
                       .filter(function(m) { return !m[m.name] })
                       .value()

      async.reduce(toResolve, {}, function(memo, mixin, callback) {
        mixin.resolve(function(m) {
          memo[m.name] = m
          callback(null, memo)
        })
      }
      , function (err, result) { done(result) })
    }
  }