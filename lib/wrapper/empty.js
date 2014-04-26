var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(modules, config) {
  var escape = config.escape['module-name']
    , content = _.chain(modules)
                 .filter(function(m) { return !!m.content })
                 .reduce(reduce, '')
                 .value()

  return content

  function reduce(result, m) {
    m.deps = _.map(m.deps, function(d) { return escape(d) })

    var code = ast.generate(m.converter.transform(), config.formatter)

    if(m.converter.type === 'amd-define')
      code = 'var ' + escape(m.name) + ' = ' + code

    return result + code + ';\n'
  }
}