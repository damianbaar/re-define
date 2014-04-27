var async = require('async')
  , _ = require('underscore')

  module.exports = function(mixins, base) {
    return function(module, done) {
      var toResolve = _.chain(module.deps)
                       .map(function(p) {
                         var m = _.find(mixins, function(m) { return m.pattern.test(p) })
                         return (m) && { mixin: m , attachedTo: p }
                       })
                       .compact()
                       .map(function(p) {
                         return _.partial( p.mixin.resolver
                                         , p.mixin.pattern
                                         , module
                                         , p.attachedTo
                                         , base
                                         , _)
                       })
                       .value()

      //TODO check if mixin have been already resolved
      async.reduce(toResolve, {}, function(memo, resolve, callback) {
        resolve(function(r) {
          memo[r.name] = r
          callback(null, memo)
        })
      }
      , function (err, result) { done(result) })
    }
  }