module.exports = 
  { cwd          : '.'
  , name         : 'module_name'
  , wrapper      : 'umd'
  , returns      : ''
  , excludeDeps  : ['\.css$', 'require', 'modules', 'exports']
  , globals      : [] //external module_name#global_ref
  , external     : {} //{"jquery": "location"} or {"..": "{path: "...", cwd: "..."}
  , discoverable : ['node_modules', 'bower_component']
  , descriptors  : ['package.json', 'bower.json']
  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!'}]
  , scopeVar     : '_scope_'
  , internalRequire : 'require'
  }

