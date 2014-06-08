module.exports = 
  { base: '.'
  , name: 'module_name'
  , wrapper: 'umd/amd-web' 
  , skipFolders: ['.git', 'node_modules', 'bower_components']
  , includeTypes: ['.html', '.js']
  , skipDeps: [/\.css/]
  , include: [] //filepath#alias, alias = module.name
  , external: [] //external-module.name#global_ref
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  }

