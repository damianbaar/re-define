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

        var desc = _.find(config.plugins, function(d) { 
          return new RegExp(d.pattern).test(pluginName) 
        })

        return { name: desc ? pluginName + d + desc.extension : d
               , path: desc ? d + desc.extension : d + '.js' }
      })
      .compact()
      .value()

    debug('%o --> %o', deps, module.deps)

    this.push(module)
    next()
  })
}
