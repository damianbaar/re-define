var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , fs = require('fs')
  , path = require('path')

module.exports = function(tmpl) {
  var base = tmpl.indexOf('.') === 0 ? __dirname : ''
    , tmplPath = path.resolve(base, tmpl)
    , template = _.template(fs.readFileSync(tmplPath, 'utf-8'))

  return function(modules, config) {
    var variable = _.template('var {{name}} = {{code}}')
      , refs = config.dependencies.references
      , escape = config.escape
      , plugins = {}
      , code

    var content = _.chain(modules)
                   .filter(function(m) { 
                     if(!m.content && !!m.type)
                       (plugins[m.type] = plugins[m.type] || []).push(m.name)

                     return !!m.content 
                   })
                   .reduce(concat, '')
                   .value()

    var external = _.chain(modules)
                    .map(function(m) { return m.type === 'internal' ? m.name : null})
                    .compact()
                    .value()

    var descriptor = {
        name: config.name
      , args: _.map(external, function(e) { return refs[e] || e }).join(', ')
      , deps: external.join(', ')
      , code: content}

    return template(_.extend(descriptor, plugins))

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
