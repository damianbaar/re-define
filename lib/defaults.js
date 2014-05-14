module.exports = 
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , follow: true
  , verbose: false
  , wrapper: 'empty'
  , dependencies: { 
    // { resolve: { '/(text\/?)*\!/': 'file or skip or ...' }
    // , ref: { 'dep_name': 'ref i.e. ns[component]'}
    }

  ///////////////////
  //Advanced usage//
  /////////////////

  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , format: {format: {indent: {style: '  ', base: 4}, space: ' '}}
  , converters: { }
  , resolvers: { }
  , wrappers: { }
  }

