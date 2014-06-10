var _ = require('lodash')
  , ast = require('./ast/adapter')
  , through = require('through2')

module.exports = function(config) {
  var converters = config.converters
    , types = _.keys(converters)
    , available
    , converter
    , code

  return through.obj(function(module, enc, next) {
    code = _.memoize(function() {
      try { return ast.parse(module.content) } 
      catch(e) { console.error(module.name, module.path, e) }
    })

    available = _.find(types, function(type) { return new RegExp(type).test(module.path) })

    alias = _.findKey(converters[available], function(c) { return c.match(code) })

    converter = converters[available][alias]

    if(!converter) console.log('Missing converter for:', module.ext)

    this.push(_.merge(module, {alias: alias}, converter.attach(module, code, alias)))
    next()
  })
}
