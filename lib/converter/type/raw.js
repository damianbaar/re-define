module.exports = function(escape) {

  function match(block) { return true }

  function attach(module, code) {
    return { 
        type      : 'raw'
      , variable  : true
      , transform : function () { return module.contents.toString() }
      }
  }

  return {
    match     : match
  , attach    : attach
  }
}

