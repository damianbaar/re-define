var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , hb = require('handlebars')
  , template = hb.compile
  , fs = require('fs')
  , path = require('path')

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

module.exports = function(tmpl) {
  var render = template(tmpl)

  return function(modules, config) {
    var variable = template('var {{{name}}} = {{{code}}}')
      , escape = config.escape
      , plugins = {}
      , code

    var content = _.chain(modules)
                   .filter(function(m) { 
                     if(!!m.type && m.type !== 'external')
                       (plugins[m.type] = plugins[m.type] || []).push(m.name)

                     return !!m.content
                   })
                   .reduce(concat, '')
                   .value()

    var external = _.chain(modules)
                    .map(function(m) { return m.type === 'external' ? m.name : null})
                    .filter(function(m) { return m !== 'exports' })
                    .compact()
                    .value()

    var exports = _.chain(modules)
                   .filter(function(m) { return m.name === config.exports })
                   .map(function(m) { return m.name && escape(m.name) })
                   .first()
                   .value()

    var descriptor = {
        name: config.name
      , config: config
      , exports: exports
      , external: external
      , code: content}

    return render(_.extend(descriptor, plugins, config.helpers))

    function concat(result, m) {
      m.deps = _.map(m.deps, function(d) { return escape(d) })
      code = !!m.transform ? m.transform() : m.ast

      if(m.variable && m.name)
        code = variable({name: escape(m.name), code: code})

      return result + code + ';\n'
    }
  }
}
