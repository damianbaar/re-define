var _ = require('lodash')
  , through = require('through2')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    var ext = path.extname(module.path)
      , dir = path.dirname(module.path)

    _.merge(module,
      { ext: ext
      , dir: dir
      , name: name() 
      })

    function name() {
      var alias = !!module.alias 
                ? module.alias 
                : path.relative(config.base, function(p) { 
                  return p.replace(path.extname(p), '') 
                }(module.path))
        , plugin = _.find(config.plugins, function(d) { return d.extension === ext })

      return plugin ? plugin.prefix + alias : alias
    }

    this.push(module)
    next()
  })
}
