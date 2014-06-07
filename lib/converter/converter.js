var _ = require('lodash')
  , acorn = require('acorn')
  , through = require('through2')

module.exports = function(converters) {
  var types = _.keys(converters)
    , available
    , converter
    , code

  return through.obj(function(module, enc, next) {

    code = _.memoize(function() {
      return acorn.parse(module.content, {sourceFile: module.path}).body
    })

    available = _.find(types, function(type) {
      return module.path.search(new RegExp(type)) > -1
    })

    alias = _.findKey(converters[available], function(c) { 
      return c.match(code) 
    })

    converter = converters[available][alias]

    if(!converter) console.log('Missing converter for:', module.ext)

    this.push(_.merge(module, {alias: alias}, converter.attach(module, code)))
    next()
  })
}
