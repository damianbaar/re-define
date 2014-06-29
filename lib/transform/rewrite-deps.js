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

        d = removeExt(file)

        var _plug = _.find(config.plugins, function(d) { return new RegExp(d.pattern).test(pluginName) })
          , _filename = _plug ? d + _plug.extension : d + '.js'
          , _path = path.resolve(path.dirname(module.path), _filename)
          , _name = removeExt(path.relative(module.base, _path))
          , _full = _plug ? pluginName + d : d

        return { name: _name, path: _path, fullName: _full }
      })
      .compact()
      .value()

    function removeExt(name) {
      var ext = path.extname(name)
      if(!!ext) return name.replace(path.extname(name), '')
      return name
    }

    debug('%o --> %o', deps, module.deps)

    this.push(module)
    next()
  })
}
