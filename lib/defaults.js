module.exports = 
  { cwd           : '.'
  , names         : {amd: 'amd/name', global: 'global.name'}
  , wrapper       : 'umd'
  , returns       : ''
  , excludeDepRef : ['\.css$', 'require', 'modules', 'exports']
  , globals      : [] //external module_name#global_ref
  , plugins      : ['^(text\/?)*!']
  , exportVar    : 'exports'

  , external     : {} //{"jquery": "location"} or {"..": "{path: "...", cwd: "..."}
  , discoverable : ['node_modules', 'bower_component']
  , descriptors  : ['package.json', 'bower.json']
  }

