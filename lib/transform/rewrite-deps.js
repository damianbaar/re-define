var _ = require('lodash')
  , through = require('through2')
  , path = require('path')

module.exports = function(config) {
  var pattern = /(.*\/?)\!/
    , isPlugin 

  return through.obj(function(module, enc, next) {
    module.deps = _.chain(module.deps)
      .map(function(d, i) {
        isPlugin = pattern.test(d)

        if(d.indexOf('.') === -1 && !isPlugin) return d

        var file = d.replace(pattern, '')
          , pluginName = d.replace(file, '')

        d = file

        if(!file) return null
        if(!!path.extname(d)) d = d.replace(path.extname(d), '')

        d = path.relative(config.base, path.resolve(module.dir, d))

        var desc = _.find(config.plugins, function(d) { 
          return new RegExp(d.pattern).test(pluginName) 
        })

        return desc ? desc.prefix + d : d 
      })
      .compact()
      .value()

    this.push(module)
    next()
  })
}
