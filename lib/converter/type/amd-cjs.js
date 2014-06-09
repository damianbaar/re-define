var _ = require('lodash')
  , cjs = require('./cjs')
  , ast = require('../ast/adapter')

module.exports = {
    match     : match
  , attach    : attach
}

function match(block) { 
  if(block().length === 1) {
    var isAMD = ast.is.amd('define', block()[0])
      , cjsDefine = getCJSDefine(block())

    if(!!cjsDefine)
      return _.isEqual(_.map(cjsDefine.params, function(d) { return d.name })
                      , ['require', 'exports', 'module'])
  }

  return false
}

function attach(mod, code) {
  return cjs.attach(mod, function() { return getCJSDefine(code()).body.body })
}

function getCJSDefine(block) {
  var define = ast.get.expressionArgs(block[0])
  if(define.length === 1 && ast.is.func(define[0])) return define[0]
}


