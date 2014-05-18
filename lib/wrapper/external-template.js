var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , hb = require('handlebars')
  , template = hb.compile
  , fs = require('fs')
  , path = require('path')

hb.registerHelper('sequence', function() {
  var args = _.toArray(arguments)
    , compose = []
    , deps = []

   _.each(args, function(i) { 
     if(_.isArray(i)) deps = deps.concat(i)
     if(_.isString(i)) deps = deps.concat([i])
     if(_.isFunction(i)) compose.push(i)
   })

  return _.compose.apply(null, compose).apply(null, deps) 
})

module.exports = function(tmpl) {
  var render = template(tmpl)

  return function(modules, config) {
    var variable = template('var {{{name}}} = {{{code}}}')
      , refs = config.dependencies.references
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
                    .compact()
                    .value()

    var descriptor = {
        name: config.name
      , args: _.map(external, function(e) { return (refs && refs[e]) || e })
      , config: config
      , deps: external
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
