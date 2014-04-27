var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }

module.exports = function(modules, config) {
  var external = _.map(modules, function(m) { return m.external && m.name })
    , escape = config.escape['module-name']

  var mixin = _.template('var {{name}} = function() { return \'{{content}}\' }')
    , variable = _.template('var {{name}} = {{code}}')
    , wrapper = _.template('(function({{deps}}) {\n{{code}}\n}) ({{deps}})')
    , code

  var content = _.chain(modules)
                 .filter(function(m) { return !!m.content })
                 .reduce(reduce, '')
                 .value()

  return wrapper({deps: _.compact(external).join(', '), code: content})

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