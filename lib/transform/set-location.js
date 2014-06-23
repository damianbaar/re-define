var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:set-location')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
    var ext = path.extname(module.path)
      , dir = path.dirname(module.path)

    _.merge(module,
      { ext: ext
      , dir: dir
      , name: name() 
      })

    debug('resolving location for "%s", \n %o', module.name, _.pick(module, 'ext', 'dir'))

    function name() {
      var alias = !!module.alias 
                    ? module.alias 
                    : path.relative(config.base, function(p) { 
                      return p.replace(path.extname(p), '') 
                    }(module.path))
        , plugin = _.find(config.plugins, function(d) { return d.extension === ext })

      if(plugin) return alias + plugin.extension
      else       return alias
    }

    this.push(module)
    next()
  })
}
