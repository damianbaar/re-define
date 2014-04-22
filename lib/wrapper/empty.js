var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(modules, config) {
  var scope = ast.create.noConflictVar(config['scope-key'])

  return _.chain(modules)
          .filter(function(m) { return !!m.content })
          .reduce(function(result, m) {
            return result + ast.generate(m.converter.transform(), config.formatter) + ';' }, '')
          .value()
}