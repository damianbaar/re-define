var _ = require('lodash') 
  , debug = require('debug')('re-define:transform:external-template')
  , path = require('path')

module.exports = function(template) {
  return function(modules, config) {

    _.each(modules.internal, function(m) {
      var props = m.properties = {}
        , file = path.relative(process.cwd(), m.path)
        , dir = path.dirname(file)

      props['__filename'] = file
      props['__dirname'] = dir
    })

    var descriptor = 
        { config: config
        , files: _.filter(modules.internal, function(f) { return !f.isNull() })
        , external: modules.external }

    return _.template(template
                     , _.extend(descriptor, config.helpers),
                     { imports: { _: _, util: config.helpers } })
  }
}

