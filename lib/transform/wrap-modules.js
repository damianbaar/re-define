var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:wrap-modules')
  , File = require('vinyl')
  , minimatch = require('minimatch')
  , version = require('../../package.json').version

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
                    .filter(function(d) {
                      return !_.find(config.exclude, function(pattern) {
                        return pattern && minimatch(d, pattern)
                      })
                    })
                    .value()

    _.each(internal, function(dep) {
      var match = _.find(cuttingPoints, function(file, pattern) {
        return minimatch(dep.path, path.join((config.cwd && path.resolve(config.cwd)) || process.cwd(), pattern))
      })

      if(match) {
        chunks[match] = chunks[match] || []
        chunks[match].push(dep)
        map[dep.path] = match
      }
    })

    if(config.development) {
      var _chunks = {}
      _.each(chunks, function(deps, path) {
        var fresh = _.any(deps, function(d) { return d.needsInvalidation })
        if(fresh) _chunks[path] = deps
        else debug('File stays untouched, there is no change detected for', path)
      })

      chunks = _chunks
    }

    debug('Wrapping: %o', files)

    _.each(chunks, function(files, output) {
      var bundle = {internal: files, external: getBundleExternals(files, external)}
        , file = new File({ cwd: process.cwd()
                          , base: path.resolve(process.cwd(), config.base)
                          , path: output })
        , header = config.buildInfo ? getHeader() : ''

      file.contents = new Buffer(header + config.wrappers[ config.wrapper ](bundle, config))

      self.push(file)

      function getHeader() {
        var header = []

        header.push('re-define version:' + version)
        if(!_.isEmpty(bundle.external)) header.push('externals: ' + bundle.external)

        return _.map(header, function(d) { return '//' + d }).join('\n') + '\n'
      }
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
