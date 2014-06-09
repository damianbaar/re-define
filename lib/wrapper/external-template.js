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

    var exports = _.chain(internal)
                   .filter(function(m) { return m.name === config.return })
                   .map(function(m) { return m.name && escape(m.name) })
                   .first()
                   .value()

    var descriptor = {
        name: config.name
      , config: config
      , exports: exports
      , external: external
      , code: content}

    return compile(template)(_.extend(descriptor, plugins, config.helpers))

    function concat(result, m) {
      m.deps = _.map(m.deps, function(d) { return escape(d) })
      code = !!m.transform ? m.transform() : m.ast

      if(m.variable && m.name)
        code = variable({name: escape(m.name), code: code})

      return result + code + ';\n'
    }
  }

  function registerHelpers() {
    hb.registerHelper('seq', function() {
      var args = _.toArray(arguments)
        , compose = []
        , deps = []
        , funcArgs

       _.each(args, function(i) { 
         if(_.isArray(i)) deps = deps.concat(i)

         if(_.isString(i) && i.indexOf('#') > -1) 
           funcArgs = i.replace(/\#/g, '').split(',')
         else if(_.isString(i)) 
           deps = deps.concat([i])

         if(_.isFunction(i)) {
           compose.push(!!funcArgs ? _.partial.apply(null, [i].concat(funcArgs)) : i)
           funcArgs = null
         }
       })

      return _.compose.apply(null, compose).apply(null, deps) 
    })
  }
}

