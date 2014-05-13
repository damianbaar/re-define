var _ = require('underscore')

var defaults = {
      base: '.'
    , main: ''
    , out: ''
    , name: 'module_name'
    , follow: true
    , verbose: false
    , wrapper: 'empty'
    , dependencies: { resolve: {} , skip: [] , ref: {} }
    , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
    , format: { format: {indent: {style: '  ', base: 2}, space: ' '}}
    , converters: {}
    , deps: {}
    , wrappers: {}
  }

module.exports = function(userConfig) { 
  var config = _.extend(defaults, userConfig)

  config.registerASTConverter = function(converter) {
    _.extend(config.converters, converter)
    return config
  }

  config.registerDepsResolver = function(resolver) {
    _.extend(config.deps, resolver)
    return config
  }

  config.registerWrapper = function(name, factory) {
    var converter = {}
    converter[name] = factory
    _.extend(config.wrappers, converter)

    return config
  }

  return config
}
