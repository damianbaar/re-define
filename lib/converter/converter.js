var _ = require('lodash')
  , acorn = require('acorn')
  , match = require('minimatch')
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
      return match(module.path, type, {matchBase: true})
    })

    converter = _.find(converters[available], function(c) { return c.match(code) })
    if(!converter) console.log('Missing converter for:', module.ext)

      //make alias
      // console.log('Missing converter for: ', module.name, module.path)
    //
    this.push(_.merge(module, converter.attach(module, code)))
    next()
  })
}
