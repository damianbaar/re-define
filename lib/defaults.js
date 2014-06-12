module.exports = 
  { base    : '.'
  , name    : 'module_name'
  , wrapper : 'umd/4all'
  , debug   : false
  , return  : ''
  , separator      : '|'
  , excludeFolders : ['.git', 'node_modules', 'bower_components']
  , excludeFiles   : [] //TODO
  , excludeDeps    : ['\.css$']
  , includeTypes   : ['\.html$', '\.js$']
  , includeFiles   : [] //filepath#alias, alias = module.name
  , externals      : [] //external module#global_ref
  , plugins        : [{extension: '.html', pattern: '^(text\/?)*!', prefix: 'txt_'}]
  , escape : function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

