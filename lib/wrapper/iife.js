var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g }

module.exports = function(modules, config) {
  var external = _.map(modules, function(m) { return m.external && m.name })
    , escape = config.escape['module-name']

  var template = _.template('(function( {{deps}} ){ {{code}} })( {{deps}} )')

  var content = _.chain(modules)
                 .filter(function(m) { return !!m.content })
                 .reduce(reduce, '')
                 .value()

  return (template)({deps: _.compact(external).join(', '), code: content})

  function reduce(result, m) {
    if(m.type === 'mixin')
      return result + 'var ' + escape(m.name) + ' = ' + '"' + m.content + '"\n'

    m.deps = _.map(m.deps, function(d) { return escape(d) })
    var code = ast.generate(m.converter.transform(), config.formatter)

    if(m.type === 'amd-define')
      code = 'var ' + escape(m.name) + ' = ' + code

    return result + code + ';\n'
  }
}