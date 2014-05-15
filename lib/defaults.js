module.exports = 
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , follow: true
  , verbose: false
  , wrapper: 'empty' 
  , dependencies: { }
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , format: {format: {indent: {style: '  ', base: 2}, space: ' '}}
  , converters: { }
  , resolvers: { }
  , wrappers: { }
  }

