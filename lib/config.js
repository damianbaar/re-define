var _ = require('underscore')
  , path = require('path')

var config = {
    src: '.'
    , export:{}
    , rename:{}
    , converters: [
      require('./converter/amd-define')
      , require('./converter/amd-require')
      ]
    , generator: { format: {indent: {style: '  ', base: 0}, space: ' '}}
    , shim: shim
    , should: {
      registerGlobal: registerGlobal
    , registerAMD: registerAMD
    }
    , is: {
      complexPath: isComplexPath
    , plugin: isPlugin
    }
    , escape: {
      varName: escapeVar
    , moduleName: escapeModuleName
    }
  }

module.exports = {
  create: function() { return _(config).clone() }
}

function shim(lib) {
  var ref

  if(!!config.rename[lib])
    ref = config.rename[lib].as

  ref = ref || lib
  return escapeModuleName(ref)
}

function normalizePath(name, filePath) {
  if(!isComplexPath(name)) return name

  if(isPlugin(name))
    return normalize(normalizePluginName(name), filePath)

  return normalize(name, filePath)

  function normalize(value, filePath) {
    return path
            .normalize(filePath.replace(/[^\/]*$/,'') + value)
            .replace(path.resolve(config.src),"")
            .replace(/\\/g,"/")
            .replace("\/","")
  }
}

function isComplexPath(name) { return /[\-\/|\\|\.]/.test(name) }
function isPlugin(name) { return name.indexOf("!") > -1 }

function escapeVar(name) { return isComplexPath(name) ? "." + name : squareBrackets(name) }
function escapeModuleName(name) { return isComplexPath(name) ? createScopeKey(name) : name }

function registerAMD(name) { return config.export[name] && !!config.export[name].amd }
function registerGlobal(name) { return !!config.export[name] && !!config.export[name].global }

function squareBrackets(lib) { return "['" + lib + "']" }
function createScopeKey(lib) { return "scope['"+ lib +"']" }

function normalizePluginName(name) { return name.replace(/^(\w*[\///]?)*!/, "") }
