var _ = require('underscore')

var config = {
      base: '.'
    , main: ''
    , out: ''
    , namespace: 'ns'
    , wrapper: 'iife'
    , converters: [
      require('./converter/amd-define')
      , require('./converter/amd-require')
      ]
    , wrappers: {
      "iife": require('./wrapper/iife')
    , "amd-define": require('./wrapper/amd-define')
    }
    , generator: { format: {indent: {style: '  ', base: 0}, space: ' '}}
    , normalize: {
      variable: escapeVar
    , module: escapeModuleName
    , plugin: normalizePluginName
    }
    , is: {
      plugin: isPlugin
    }
  }

module.exports = function() { return _(config).clone() }

function isComplexName(name) { return /[\-\/|\\|\.]/.test(name) }
function isPlugin(name) { return name.indexOf("!") > -1 }

function escapeVar(name) { return isComplexName(name) ? "." + name : squareBrackets(name) }
function escapeModuleName(name) { return isComplexName(name) ? createScopeKey(name) : name }

function squareBrackets(lib) { return "['" + lib + "']" }
function createScopeKey(lib) { return "scope['"+ lib +"']" }

function normalizePluginName(name) { return name.replace(/^(\w*[\///]?)*!/, "") }
