var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(modules, config) {
  var scope = ast.create.noConflictVar(config['scope-key'])

  return _.chain(modules)
          .filter(function(m) { return !!m.content })
          .reduce(function(result, m) {
            var code = ast.generate(m.converter.transform(), config.formatter)

            if(m.converter.type === 'amd-define')
              code = 'var ' + m.name + ' = ' + code

            return result + code + ';\n' }, '')
          .value()
}