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
     if(_.isFunction(i)) compose.push(i)
   })

  return _.compose.apply(null, compose).apply(null, deps) 
})

module.exports = function(tmpl) {
  var base = tmpl.indexOf('.') === 0 ? __dirname : ''
    , tmplPath = path.resolve(base, tmpl)
    , render = template(fs.readFileSync(tmplPath, 'utf-8'))

  return function(modules, config) {
    var variable = template('var {{{name}}} = {{{code}}}')
      , refs = config.dependencies.references
      , escape = config.escape
      , plugins = {}
      , code

    var content = _.chain(modules)
                   .filter(function(m) { 
                     if(!m.content && !!m.type && m.type !== 'external')
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
      , args: _.map(external, function(e) { return refs[e] || e })
      , deps: external
      , code: content}

    return render(_.extend(descriptor, plugins, config.helpers))

    function concat(result, m) {
      if(m.resolved)
        return result + (m.content ? m.content + ';\n' : '')

      m.deps = _.map(m.deps, function(d) { return escape(d) })
      code = ast.generate(m.transform(), config.format)

      if(m.type === 'amd-define')
        code = variable({name: escape(m.name), code: code})

      return result + code + ';\n'
    }
  }
}
