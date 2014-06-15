var _ = require('lodash')
  , ast = require('./ast/adapter')
  , through = require('through2')
  , debug = require('debug')('re-define:converter')
  , colors = require('colors')

module.exports = function(config) {
  var converters = config.converters
    , types = _.keys(converters)
    , available
    , converter
    , code

  return through.obj(function(module, enc, next) {
    code = _.memoize(function() { return ast.parse(module.content) })

    try {
      available = _.find(types, function(type) { return new RegExp(type).test(module.ext) })

      alias = _.findKey(converters[available], function(c) { return c.match(code) })

      converter = converters[available][alias]
      module = _.merge(module, converter.attach(module, code))
    } catch(e) {
      debug('Error in %s %o'.red, module.name || module, e)

      next()
      return
    }

    debug('converting %s using %s', module.name, alias)

    this.push(module)
    next()
  })
}
