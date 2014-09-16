var _ = require('lodash') 
  , debug = require('debug')('re-define:transform:external-template')
  , path = require('path')

module.exports = function(template) {
  return function(modules, config, requestedFromTemplate) {

    if(!requestedFromTemplate) {
      _.each(modules.internal, function(m) {
        var props = m.properties = {}
          , file = path.relative(process.cwd(), m.path)
          , dir = path.dirname(file)

        props['__filename'] = file
        props['__dirname'] = dir
      })

      var names = _.pluck(modules.internal, 'name')
        , paths = _(modules.internal)
                    .pluck('path')
                    .map(function(d) {
                      return path.relative(process.cwd(), d)
                    }).value()
        , mods = _.zipObject(paths, names)
        , returns = config.returns.replace('./','')

        config.returns = mods[returns] || config.returns
    } 

    var templateData = { config: _.omit(config, 'helpers')
                       , files: modules.internal
                       , external: modules.external }
      , util = config.helpers
      , imports

    util.getTemplate = function(template, imports) { 
      var conf = _.cloneDeep(config)
      if(!!imports) conf.imports = (imports || []).concat(config.imports)

      return _.template(config.wrappers[template](modules, conf, true), templateData, imports)
    }

    imports = { imports: { _: _, util: util}}
   
    return _.template(template, templateData, imports)
  }
}

