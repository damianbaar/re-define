var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:rewrite-deps')

module.exports = function(config) {
  var pattern = /(.*\/?)\!/
    , isPlugin 

  return through.obj(function(module, enc, next) {
    var deps = module.deps

    module.deps = _.chain(module.deps)
      .map(function(d, i) {
        isPlugin = pattern.test(d)

        var file = d.replace(pattern, '')
          , pluginName = d.replace(file, '')

        d = file

        if(!file) return null
        if(!!path.extname(d)) d = d.replace(path.extname(d), '')

        var _plug = _.find(config.plugins, function(d) { return new RegExp(d.pattern).test(pluginName) })
          , _name = _plug ? d + _plug.extension : d + '.js'
          , _path = path.relative(module.base, path.resolve(path.dirname(module.path), _name))
          , _real = _plug ? pluginName + d + _plug.extension : d

        return { name: _real, path: _path }
      })
      .compact()
      .value()

    debug('%o --> %o', deps, module.deps)

    this.push(module)
    next()
  })
}
