var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , fs = require('fs')
  , path = require('path')

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }

module.exports = function(tmpl) {
  var base = tmpl.indexOf('.') === 0 ? __dirname : ''
    , tmplPath = path.resolve(base, tmpl)
    , template = _.template(fs.readFileSync(tmplPath, 'utf-8'))

  //TODO rewriting refs from outside libs

  return function(modules, config) {
    var mixin = _.template('var {{name}} = function() { return \'{{content}}\' }')
      , variable = _.template('var {{name}} = {{code}}')
      , escape = config.escape['module-name']
      , code

    var content = _.chain(modules)
                   .filter(function(m) { return !!m.content })
                   .reduce(reduce, '')
                   .value()

    var external = _.chain(modules)
                    .map(function(m) { return m.external ? m.name : null})
                    .compact()
                    .value()

    return template({
        name: config.name
      , deps: _.map(external, function(d) { return '\'' + d + '\''}).join(', ')
      , args: external.join(', ')
      , code: content})

    function reduce(result, m) {
      if(m.type === 'mixin')
        return result + mixin({name: escape(m.name), content: m.content}) + ';\n'

      m.deps = _.map(m.deps, function(d) { return escape(d) })
      code = ast.generate(m.converter.transform(), config.formatter)

      if(m.type === 'amd-define')
        code = variable({name: escape(m.name), code: code})

      return result + code + ';\n'
    }
  }
}