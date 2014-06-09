var _ = require('lodash')
  , through = require('through2')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    module.deps = _.chain(module.deps)
      .map(function(d, i) {
        if(d.search(/(.*\/?)\!/) > -1) d = d.replace(/(.*\/?)\!/, '')

        if(d.indexOf('.') === -1) return d

        if(!!path.extname(d)) d = d.replace(path.extname(d), '')

        return path.relative(config.base, path.resolve(module.dir, d))
      })
      .compact()
      .value()

    this.push(module)
    next()
  })
}
