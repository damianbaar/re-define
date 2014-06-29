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

        if(d.indexOf('.') === -1 && !isPlugin) 
          return {name: d, path: d, orig: d}

        var file = d.replace(pattern, '')
          , pluginName = d.replace(file, '')

        var _plug = _.find(config.plugins, function(d) { return new RegExp(d.pattern).test(pluginName) })
          , _filename = _plug ? file : file + '.js'
          , _path = path.resolve(path.dirname(module.path), _filename)
          , _name = removeExt(path.relative(module.base, _path))
          , _orig = _plug ? pluginName + d : d

        return { name: _name
               , path: _path
               , orig: _orig }
      })
      .compact()
      .value()

    function removeExt(name) {
      var ext = path.extname(name)
      return !!ext ? name.replace(ext, '') : name
    }

    debug('%o --> %o', deps, module.deps)

    this.push(module)
    next()
  })
}
