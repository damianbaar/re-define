var _ = require('lodash') 
  , hb = require('handlebars')
  , compile = hb.compile
  , generate = require('escodegen').generate

module.exports = function(template) {
  return function(modules, config) {

    registerHelpers()

    var scope = config.scopeVar + '[\'{{{name}}}\'] = '
      , js = compile('var {{{escaped}}} = ' + scope + '(function() { {{{code}}} })()')
      , raw = compile('var {{{escaped}}} = ' + scope + '{{{code}}}')
      , ext = compile('{{{code}}}')
      , escape = config.escape

    var bundles = _(modules.internal)
                  .map(function(modules, bundle) {
                    var code
                      , returns 

                    code = _.chain(modules)
                            .each(function(m) { m.wrap = m.ext === '.js' && !!m.ast })
                            .reduce(concat, '')
                            .value() 

                    returns = _(modules)
                              .pluck('require')
                              .compact()
                              .last()

                    return  { name: bundle
                            , code: code
                            , returns: returns || ''
                            , wrap: _(modules).pluck('wrap').some()
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
      code = m.ast && generate(m.ast)
      content = m.contents

      if(!code && !content) return result 

      var name = m.require
        , tmpl = m.wrap ? js : raw
      
      tmpl = m.ext === '.js' && !m.ast ? ext : tmpl

      code = tmpl({name: name.replace(/\\\\|\\/g, '/')
                 , escaped: escape(name)
                 , code: code || content})

      return result + code + '\n'
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

