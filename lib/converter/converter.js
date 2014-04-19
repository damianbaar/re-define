var ast = require('../ast/ast-adapter')

module.exports = function(converters) {
  return function(module) {
    var code = ast.parse(module.content, true)[0]
    var converter = getConverter(code)

    console.log('converter', module.name)

    return {
      convert: convert
      , deps: deps
    }

    function deps() {
      return converter ? converter.deps(code, module) : null
    }

    function convert() {
      if(converter) code = converter.convert(code, module)
      else console.log('No registered converter for:', module)

      return module
    }

    function getConverter(body) {
      var converter

      for(var i = 0; i < converters.length; i++) {
        if(converters[i].match(body)) {
          converter = converters[i]
          break
        }
      }

      return converter
    }
  }
}