module.exports = 
  { base: '.'
  , main: ''
  , name: 'module_name'
  , follow: true
  , verbose: false
  , wrapper: 'umd/amd-web' 
  , fileFilter: ['*.html', '*.js']
  , exclude: ['*.css']
  , dependencies:
    { alias:{ 
        "*.html": "text"
      }
      , glob: {
      }
    }
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

