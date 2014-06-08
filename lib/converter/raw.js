var _ = require('underscore')

module.exports = function(escape) {

  function match(block) { return true }

  function attach(module, code) {
    return { 
        type      : 'raw'
      , variable  : true
      , transform : function () { return escape(module.content) }
      }
  }

  return {
    match     : match
  , attach    : attach
  }
}

