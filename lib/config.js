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
  }

module.exports = function(userConfig) { 
  var config = _.extend(defaults, userConfig)

  config.registerASTConverter = function(converter) {
    return _.extend(config.converters, converter)
  }

  config.registerDepsResolver = function(resolver) {
    return _.extend(config.deps, converter)
  }

  config.registerWrapper = function(name, factory) {
    var converter = {}
    converter[name] = factory
    return _.extend(config.wrappers, converter)
  }

  return config
}
