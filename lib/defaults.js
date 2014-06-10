module.exports = 
  { base    : '.'
  , name    : 'module_name'
  , wrapper : 'umd/amd-web'
  , return  : ''
  , separator      : '|'
  , excludeFolders : ['.git', 'node_modules', 'bower_components']
  , excludeFiles   : []
  , excludeDeps    : ['\.css$/']
  , includeTypes   : ['\.html$', '\.js$']
  , includeFiles   : [] //filepath#alias, alias = module.name
  , externals      : [] //external module#global_ref
  , escape : function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

