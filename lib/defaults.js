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
  }

