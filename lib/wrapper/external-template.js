var _ = require('lodash') 
  , debug = require('debug')('re-define:transform:external-template')
  , path = require('path')

module.exports = function(template) {
  return function(modules, config, requestedFromTemplate) {

    if(!requestedFromTemplate) {
      var last = _.last(modules.internal)
        , cwd = (config.cwd && path.resolve(config.cwd)) || process.cwd()
        , base = path.join(cwd, config.base)

      _.each(modules.internal, function(m) {
        var props = m.properties = m.properties || {}

        props.process && (props.process = 'window ? {env: {}} : process')
        props.define && (props.define = 'null')

        if(!props.__filename && !props.__dirname) return

        var file = path.relative(!m.external ? base : cwd, m.path)
          , dir = path.dirname(file)

        props['__filename'] = '"' + path.basename(escape(file)) + '"'
        props['__dirname'] =  '"' + path.join(escape(dir)) + '"'

        function escape(val) { return val.replace(/\\\\|\\/g, '/') }
      })

      var names = _.pluck(modules.internal, 'name')
        , paths = _(modules.internal)
                    .pluck('path')
                    .map(function(d) { return path.resolve(d) }).value()
        , mods = _.zipObject(paths, names)
        , returns = !!config.returns && path.resolve(base, config.returns)

        if(!path.extname(returns)) returns = returns + '.js'

        returns = mods[returns]

        if(returns) config.returns = returns
        if(!returns && !config.returns) config.returns = last.name
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

