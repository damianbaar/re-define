var _ = require('underscore')
  , config = {
    converters: [
      require('./converter/amd-define')
      , require('./converter/amd-require')
      ]
    , resolve:{}
    , export:{}
    , generator: { format: {indent: {style: '  ', base: 0}, space: ' '}}
    , shim: shim
    , global: global
    , escape: escape
  }

module.exports = {
  create: function() { return _(config).clone() }
}

function shim(lib) {
  var ref

  if(!!config.resolve[lib])
    ref = config.resolve[lib].as

  ref = ref || lib
  return escapeLib(ref)
}

function escape(name) {
  return isComplexPath(name) ? "." + name : squareBrackets(name)
}

function escapeLib(lib) {
  return isComplexPath(lib) ? createScopeKey(lib) : lib
}

function isAMD(lib) {
  return config.export[lib] && !!config.export[lib].amd
}

function global(lib) {
  return !!config.export[lib] && !!config.export[lib].global
}

function squareBrackets(lib) {
  return "['" + lib + "']"
}

function isComplexPath(lib) { return /[\-\/|\\|\.]/.test(lib) }

function isPlugin(lib) { return lib.indexOf("!") > -1 }

function createScopeKey(lib) { return "scope['"+ lib +"']" }