var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:rewrite-deps')

module.exports = function(config) {
  var pattern = /(.*\/?)\!/
    , isPlugin 

  return through.obj(function(file, enc, next) {
    var deps = file.deps

    //TODO could be prettier
    if(!file.parent) file.parent = removeExt(file.relative)
    if(!file.name) file.name = removeExt(file.relative)
    if(!file.require) file.require = file.name

    _.each(file.deps, function(d) {
      isPlugin = pattern.test(d.require)

      if(d.require.indexOf('.') === -1 && !isPlugin) {
        file.external = (file.external || [])
        file.external.push(d.require)
        return
      }

      var filepath = d.require.replace(pattern, '')
        , pluginName = d.require.replace(filepath, '')

      var _plug = _.find(config.plugins, function(d) { return new RegExp(d.pattern).test(pluginName) })
        , _filename = _plug ? filepath : filepath + '.js'
        , _path = path.resolve(path.dirname(file.path), _filename)
        , _rel = path.relative(file.base, _path)
        , _name = _plug ? pluginName + './' + _rel : removeExt(_rel)

      d.path = _path
      d.name = _name
      d.require = _name
      d.update()
    })

    function removeExt(name) {
      var ext = path.extname(name)
      return !!ext ? name.replace(ext, '') : name
    }

    debug('%o --> %o', deps, file.deps)

    this.push(file)
    next()
  })
}
