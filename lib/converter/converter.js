var ast = require('../ast/ast-adapter')

module.exports = function(converters) {
  return function(module) {
    var code = ast.parse(module.content, true)[0]
    var converter = getConverter(code)

    return {
      injectAST: injectAST
      , injectDeps: injectDeps
      , injectName: injectName
      , injectParams: injectParams
    }

    function injectDeps() {
      if(converter) module.deps = converter.deps(code)
      else console.log('Cannot resolve dependencies:', module)

      return this
    }

    function injectAST() {
      if(converter) module.ast = converter.convert(code, module.name)
      else console.log('No registered converter for:', module)

      return this
    }

    function injectParams() {
      if(converter) module.params = converter.params(code)
      else console.log('Cannot resolve params', module)

      return this
    }

    function injectName() {
      if(converter) module.name = module.name || converter.name(code, module)
      else console.log('Cannot resolve name:', module)

      return this
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