var ast = require('../ast/ast-adapter')

module.exports = {
  convert: convert
}

function convert(converters, module) {
  var code = ast.parse(module.content, true)[0]
    , converter = getConverter(converters, code)

  if(converter) code = converter.convert(code, module)
  else console.log('No registered converter for:', module)

  return module
}

function getConverter(converters, body) {
  var converter

  for(var i = 0; i < converters.length; i++) {
    if(converters[i].match(body)) {
      converter = converters[i]
      break
    }
  }

  return converter
}
