var _ = require('lodash')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:amd-plugin')

module.exports = function(config, writer) {
  return through.obj(function(file, enc, next) {
    var plugin = _.find(config.plugins, function(d) { 
      return new RegExp(d).test(file.reference) && d
    })

    if(!plugin || !file.isNull()) {
      this.push(file)
      next()
      return
    }

    plugin = new RegExp(plugin)

    var _file = file.reference.replace(plugin, '')
      , _rel = path.relative(file.cwd, _file)

    file.name = _rel
    file.reference = _rel
    file.path =  path.resolve(file.base, _file)

    file.updateParent()

    writer.write(file)
    next()
  })
}
