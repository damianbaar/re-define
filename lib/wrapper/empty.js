var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(modules, config) {
  var escape = config.escape
    , variable = _.template('var {{name}} = {{code}}')
    , code

  return _.chain(modules)
          .filter(function(m) { return !!m.content})
          .reduce(reduce, '')
          .value()

  function reduce(result, m) {
    if(m.type === 'resolver')
      return result + m.content + ';\n'

    m.deps = _.map(m.deps, function(d) { return escape(d) })
    code = ast.generate(m.transform(), config.format)

    if(m.type === 'amd-define')
      code = variable({name: escape(m.name), code: code})

    return result + code + ';\n'
  }
}
