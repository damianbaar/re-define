var _ = require('lodash')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    //TODO if deps.length != params.length
    module.deps = _.chain(module.deps)
      .map(function(d) {
        var found = _.some(config.skipDeps, 
                      function(p) { 
                        return d.search(new RegExp(p, 'g') ) > -1
                    })
        return found ? null : d
      })
      .compact()
      .value()

    this.push(module)
    next()
  })
}
