var _ = require('lodash') 
  , ast = require('../ast/adapter')
  , hb = require('handlebars')
  , compile = hb.compile

module.exports = function(template) {
  return function(modules, config) {

    registerHelpers()

    var initScope = _(modules.internal).pluck('complex').compact().some()
    modules = _.merge(_.groupBy(modules.internal, 'parent'), {external: modules.external})

    var scope = initScope ? config.scopeVar + '[\'{{{name}}}\'] = ' : ''
      , variable = compile('var {{{escaped}}} = ' + scope + '(function() { {{{code}}} })()')
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
        , bundles: bundles
        , external: modules.external }

    return compile(template)(_.extend(descriptor, config.helpers))

    function concat(result, m) {
      code = m.ast && ast.generate(m.ast)
      content = m.contents

      if(!code && !content) return result 

      if(!!m.require)
        code = variable({name: m.require.replace(/\\\\|\\/g, '/')
                       , escaped: escape(m.require)
                       , code: code || content})

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

