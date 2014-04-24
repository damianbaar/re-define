var _ = require('underscore')

var config = {
      base: '.'
    , main: ''
    , out: ''
    , wrapper: 'empty'
    , converters: {
      'amd-define':  {
        resolver: require('./converter/amd-define-resolver')
      , transformer: require('./converter/amd-define-transformer')
      }
      , 'amd-require': {
        resolver: require('./converter/amd-require-resolver')
      , transformer: require('./converter/amd-require-transformer')
      }
    }
    , 'scope-key': '__scope__'
    , wrappers: {
      'empty': require('./wrapper/empty')
    , 'iife': require('./wrapper/iife')
    , 'amd-define': require('./wrapper/amd-define')
    }
    , escape: {
      "module-name": function (val) { return val.replace(/\/|\\|-/g, '_') }
    }
    , formatter: { format: {indent: {style: '  ', base: 0}, space: ' '}}
  }

module.exports = function(userConfig) {
  var conf
    , normalize = { variable: escapeVar
                  , args: escapeArgs }

  conf = _.extend(config, userConfig, {normalize: normalize})

  return conf

  function escapeVar(name) { return isComplexName(name) ? '.' + name : squareBrackets(name) }
  function escapeArgs(name) { return isComplexName(name) ? createScopeKey(name) : name }
  function squareBrackets(lib) { return '[\'' + lib + '\']' }
  function createScopeKey(lib) { return conf['scope-key'] + squareBrackets(lib) }
  function isComplexName(name) { return /[\-\/|\\|\.]/.test(name) }
}

// function isPlugin(name) { return name.indexOf('!') > -1 }
// function normalizePluginName(name) { return name.replace(/^(\w*[\///]?)*!/, '') }
// function (){
//     var pluginPattern = /(^(?:(?:\w+)\/*)*\!)/
//     if(value.search(pluginPattern) > -1) {
//       return value.replace(pluginPattern, "/_")
//     }
//   }