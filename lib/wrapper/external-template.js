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

    var templateData = { config: _.omit(config, 'helpers')
                       , files: _.filter(modules.internal, function(f) { return !f.isNull() })
                       , external: modules.external }
      , imports

    var util = config.helpers

    util.getTemplate = function(template, imports) { 
      var conf = _.cloneDeep(config)
      if(!!imports) conf.imports = (imports || []).concat(config.imports)

      return _.template(config.wrappers[template](modules, conf), templateData, imports)
    }

    imports = { imports: { _: _, util: util}}

    return _.template(template, templateData, imports)
  }
}

