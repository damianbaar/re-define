var _ = require('lodash') 
  , hb = require('handlebars')
  , compile = hb.compile

module.exports = function(template) {
  return function(internal, external, config) {

    registerHelpers()

    var variable = compile('var {{{name}}} = {{{code}}}')
      , escape = config.escape
      , plugins = {}
      , code

    var content = _.chain(internal)
                   .reduce(concat, '')
                   .value()

    var returns = _.chain(internal)
                   .filter(function(m) { return m.name === config.return })
                   .map(function(m) { return m.name && escape(m.name) })
                   .value()

    var included = _.chain(internal)
                    .filter(function(m) { return m.external })
                    .map(function(m) { return m.name })
                    .value()

    var descriptor = {
        name: config.name
      , config: config
      , returns: returns
      , included: included
      , external: external
      , internals: _.pluck(internal, 'name')
      , code: content}

    return compile(template)(config.beforeRender(_.extend(descriptor, plugins, config.helpers)))

    function concat(result, m) {
      m.deps = _.map(m.deps, function(d) { return escape(d) })
      code = !!m.transform ? m.transform() : m.ast

      if(m.variable && !!m.name)
        code = variable({name: escape(m.name), code: code})

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

