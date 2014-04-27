var _ = require('underscore')

var config = {
      base: '.'
    , main: ''
    , out: ''
    , follow: true
    , verbose: false
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
    , mixins: [
      { pattern : /text!/, resolver: require('./converter/mixin/file') }
    ]
    , wrappers: {
      'empty': require('./wrapper/empty')
    , 'iife': require('./wrapper/iife')
    , 'amd-define': require('./wrapper/amd-define')
    }
    , escape: {
      "module-name": function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
    }
    , formatter: { format: {indent: {style: '  ', base: 0}, space: ' '}}
  }

module.exports = function(userConfig) {
  return _.extend(config, userConfig)
}

// function isPlugin(name) { return name.indexOf('!') > -1 }
// function normalizePluginName(name) { return name.replace(/^(\w*[\///]?)*!/, '') }
// function (){
//     var pluginPattern = /(^(?:(?:\w+)\/*)*\!)/
//     if(value.search(pluginPattern) > -1) {
//       return value.replace(pluginPattern, "/_")
//     }
//   }