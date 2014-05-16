var _ = require('underscore')

module.exports = 
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , follow: true
  , verbose: false
  , wrapper: 'empty' 
  , dependencies: { }
  , format: { format: {indent: {style: '  ', base: 2}, space: ' '}}
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , helpers: {
      escape: function() { return _.map(arguments, function(i) { return '\'' + i + '\'' }) }
    , join: function() { return _.toArray(arguments).join(',') } 
  }
  , converters: { }
  , resolvers: { }
  , wrappers: { }
  }

