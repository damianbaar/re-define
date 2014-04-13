var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = {
  //TODO introduce cache
  //Limitation 1 file 1 module
  deps: function(content) {

    var code = ast.parse(content, true)
      , expression = ast.get.expressionArgs(code[0])

    return  _(expression[0].elements).map(function(e) { return e.value })
  }
}
