var _ = require('lodash') 
  , hb = require('handlebars')
  , compile = hb.compile

module.exports = function(template) {
  return function(modules, config) {

    registerHelpers()

    var variable = compile('var {{{escaped}}} = ' + config.scopeVar + '[\'{{{name}}}\'] = {{{code}}}')
      , escape = config.escape

    var bundles = _(modules)
                  .map(function(modules, bundle) {
                    var code
                      , returns 

                    code = _.chain(modules)
                            .reduce(concat, '')
                            .value() 

                    returns = _(modules)
                              .pluck('name')
                              .compact()
                              .last()

                    return  { name: bundle
                            , code: code
                            , returns: returns || ''
                            }
                  })
                  .filter(function(m,b) { return m.code })
                  .value()

    var descriptor = 
        { config: config
        , bundles: bundles.reverse()
        , external: modules.external }

    return compile(template)(_.extend(descriptor, config.helpers))

    function concat(result, m) {
      m.deps = _.map(m.deps, function(d) { return {name: escape(d.name)} })

      code = !!m.transform && m.transform()

      if(!code) return result 

      if(m.variable && !!m.name)
        code = variable({name: m.name.replace(/\\\\|\\/g, '/'), escaped: escape(m.name), code: code})

      return result + code + ';\n'
    }

    function registerHelpers() {
      _.each(config.helpers, function(helper, name) {
        hb.registerHelper(name, function() {
          var args = _.toArray(arguments)
            , context = args.pop()

          return helper.apply(context, args)
        })
      })

      hb.registerHelper('chain', function() {
        var args = _.toArray(arguments)
          , toCompose = []
          , deps = []
          , currentFunc
          , currentArgs = []

         _.each(args, function(arg, idx) { 
          if(_.isArray(arg)) deps = deps.concat(arg)

          if(_.isFunction(arg)) {
            if(currentFunc) toCompose.push(_.partial.apply(null, [currentFunc].concat(currentArgs)))

            currentFunc = arg
            currentArgs = []
          }

           if(_.isString(arg)) currentArgs.push(arg)

           if(idx === args.length - 2)
            toCompose.push(_.partial.apply(null, [currentFunc].concat(currentArgs)))
        })

        return _.compose.apply(null, toCompose.reverse()).apply(null, deps) 
      })
    }
  }
}

