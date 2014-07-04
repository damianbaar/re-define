var _ = require('lodash')
  , ast = require('./ast/adapter')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:converter')
  , colors = require('colors')

module.exports = function(config) {
  var converters = config.converters
    , types = _.keys(converters)
    , available
    , converter
    , code

  return through.obj(function(file, enc, next) {
    code = _.memoize(function() { return ast.parse(file.contents) })

    try {
      available = _.find(types, function(type) { 
        return new RegExp(type).test(path.extname(file.path)) 
      })

      alias = _.findKey(converters[available], function(c) { return c.match(code) })

      converter = converters[available][alias]
      file = _.merge(file, converter.attach(code, config))
    } catch(e) {
      debug('Error in %s %o'.red, file.name || file, e)
      this.emit('error', e)

      next()
      return
    }

    debug('converting %s using %s', file.path, alias)

    this.push(file)
    next()
  })
}
