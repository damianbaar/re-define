var _ = require('underscore')

module.exports = {
    match     : match
  , attach    : attach
}

function match(block) { return true }

function attach(module, code) {
  return { 
      type      : 'raw'
    , variable  : true
    , transform :   function () { return module.content }
    }
}
