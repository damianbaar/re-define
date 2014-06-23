module.exports = 
  { base         : '.'
  , name         : 'module_name'
  , wrapper      : 'umd/4all'
  , debug        : false
  , return       : ''
  , fileFilter   : ["./**/*.+(js|html)", "!./**/+(bin|test|node_modules|bower_components)/**/*.*"]
  , excludeDeps  : ['\.css$','require']
  , includeFiles : [] //filepath#alias, alias = module.name
  , externals    : [] //external module_name#global_ref
  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!'}]
  , escape       : function (val) { return val.replace(/\!|\.|\/|\\|-/g, '_') }
  , beforeRender : function (info) { return info }
  , scopeVar     : '_scope_'
  , requireFunc  : 'local_require'
  }

