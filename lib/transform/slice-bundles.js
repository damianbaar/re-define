var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , minimatch = require('minimatch')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(bundle, enc, next) {
    var cuttingPoints = config.slice
      , chunks = {}
      , map = {}
      , self = this

    _.each(bundle.internal, function(dep) {
      var match = _.find(cuttingPoints, function(file, pattern) {
        return minimatch(dep.path, process.cwd() + '/' + pattern)
      })

      if(match) {
        chunks[match] = chunks[match] || []
        chunks[match].push(dep)
        map[dep.path] = match
      }
    })

    _.each(chunks, function(files, output) {
      self.push({ output: output
                , internal: files
                , external: getBundleExternals(files)})
    })

    function getBundleExternals(files) {
      var external = bundle.external
        , deps = _(files)
                  .pluck('dependencies')
                  .flatten()
                  .map('name')
                  .value()

      return _.intersection(deps, external)
    }

    next()
  })
}
