var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  file: file
, stream: stream
}

function stream(converters, input, callbacks) {
  var code = ast.parse(input, true)
    , converter

  _(code).each(function(module) {
    converter = getConverter(converters, module)

    if(converter) callbacks.onModule(converter.convert(module, {}))
  })
}

function file(converters, module) {
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
