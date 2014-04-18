var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  file: file
}

function file(converters, module) {
  var code = ast.parse(module.content, true)
    , converter = getConverter(code)

  if(converter) code = converter.convert(code, module)
  else console.log('No registered converter for:', module)

  return module

  function getConverter(node) {
    var converter

    for(var i = 0; i < converters.length; i++) {
      if(converters[i].match(node)) {
        converter = converters[i]
        break
      }
    }

    return converter
  }
}


