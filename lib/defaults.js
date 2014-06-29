module.exports = 
  { cwd          : '.'
  , name         : 'module_name'
  , wrapper      : 'umd'
  , debug        : false
  , return       : ''
  , excludeDeps  : ['\.css$','require']
  , externals    : [] //external module_name#global_ref

  , external     : {} //{"jquery": "location"} or {"..": "{path: "...", cwd: "..."}
  , discoverable : ['node_modules', 'bower_component']
  , descriptors  : ['package.json', 'bower.json']

  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!'}]
  , escape       : function (val) { return val.replace(/\!|\.|\/|\\|-/g, '_') }
  , scopeVar     : '_scope_'
  , requireFunc  : 'local_require'
  }

