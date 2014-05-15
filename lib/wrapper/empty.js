var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }

//Just an example
module.exports = function(modules, config) {
  var escape = config.escape
    , resolver = _.template('var {{name}} = function() { return \'{{content}}\' }')
    , variable = _.template('var {{name}} = {{code}}')
    , code

  return _.chain(modules)
          .filter(function(m) { return !!m.content})
          .reduce(reduce, '')
          .value()

  function reduce(result, m) {
    if(m.type === 'resolver')
      return result + resolver({name: m.name, content: m.content}) + ';\n'

    m.deps = _.map(m.deps, function(d) { return escape(d) })
    code = ast.generate(m.converter.transform(), config.format)

    if(m.type === 'amd-define')
      code = variable({name: escape(m.name), code: code})

    return result + code + ';\n'
  }
}
