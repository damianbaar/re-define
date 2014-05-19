module.exports = 
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , follow: true
  , verbose: false
  , wrapper: 'umd/amd-web' 
  , dependencies:
    { resolve: 
      { "^(text\/?)*!": "text",
        "^(css\/?)*!": "skip"
        // "^(css\/?)*!": "skip:alias" -> template {{{alias}}}
      }
      , references: {}
    }
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

