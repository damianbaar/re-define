var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:wrap-modules')
  , File = require('vinyl')
  , minimatch = require('minimatch')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var cuttingPoints = config.slice
      , chunks = {}
      , map = {}
      , self = this

    var internal = _.filter(files, function(d) { return !d.isNull() })
      , external = _(files)
                    .pluck('name')
                    .uniq()
                    .difference(_.pluck(internal,'name'))
                    .value()

    _.each(internal, function(dep) {
      var match = _.find(cuttingPoints, function(file, pattern) {
        return minimatch(dep.path, path.join(process.cwd(), config.base,  pattern))
      })

      if(match) {
        chunks[match] = chunks[match] || []
        chunks[match].push(dep)
        map[dep.path] = match
      }
    })

    debug('Wrapping: %o', files)

    _.each(chunks, function(files, output) {
      var bundle = {internal: files, external: getBundleExternals(files, external)}
        , file = new File({ cwd: process.cwd()
                          , base: path.resolve(process.cwd(), config.base)
                          , path: output })

      file.contents = new Buffer(config.wrappers[ config.wrapper ](bundle, config))
      self.push(file)
    })

    function getBundleExternals(files, external) {
      var deps = _(files)
                  .pluck('dependencies')
                  .flatten()
                  .map('name')
                  .value()

      return _.intersection(deps, external)
    }

    next()
  })
}
