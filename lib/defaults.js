module.exports = 
  { base    : '.'
  , name    : 'module_name'
  , wrapper : 'umd/amd-web'
  , return  : ''
  , separator     : '|'
  , excludeFolder : ['.git', 'node_modules', 'bower_components']
  , excludeFile   : []
  , excludeDep    : ['\.css$/']
  , includeType   : ['\.html$', '\.js$']
  , includeFile   : [] //filepath#alias, alias = module.name
  , external      : [] //external-module.name#global_ref
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

