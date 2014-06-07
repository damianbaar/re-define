module.exports = 
  { base: '.'
  , name: 'module_name'
  , wrapper: 'umd/amd-web' 
  , skipFolders: ['.git', 'node_modules', 'bower_components']
  , includeTypes: ['.html', '.js']
  , dependencies:
    { alias:{ 
        "*.html": "text"
      }
      , glob: {
      }
    }
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

