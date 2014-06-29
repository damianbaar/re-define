module.exports = 
  { base         : '.'
  , name         : 'module_name'
  , wrapper      : 'umd'
  , debug        : false
  , return       : ''
  , excludeDeps  : ['\.css$','require']
  , external     : {} //filepath#alias, alias = module.name
  , externals    : [] //external module_name#global_ref
  , discoverableDirs : ['node_modules', 'bower_component']
  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!'}]
  , escape       : function (val) { return val.replace(/\!|\.|\/|\\|-/g, '_') }
  , scopeVar     : '_scope_'
  , requireFunc  : 'local_require'
  }

