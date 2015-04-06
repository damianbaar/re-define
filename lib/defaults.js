module.exports = 
  { names         : { amd: 'amd/name', global: 'global.name' }
  , project       : '' //project name, adding a prefix to internal module name
  , returns       : ''
  , globals      : {} //external {lib:global}

  //working directory
  , cwd           : '.'
  //define cutting points for modules { glob_pattern: file, ... }
  , slice         : {"**/**": "bundle.js"}
  //could be a folder (in case of many files) or just file, when not defined print output to console
  , output        : ''
  //base folder, all modules will be aligned to this one, like cwd: a, file: a/b/c, base: a/b, file -> c
  , base          : ''
  //wrapper file 
  , wrapper       : 'browserify'
  //attach all bundled modules to namespace, foo.baz.bar is allowed
  , namespace: '' 
  //skip dependencies from externals (won't be included in wrapper as external for all module definition, assume that dep will be taken from namespace)
  , exclude: []
  , empty: []
  //exclude specific AMD dependencies
  , excludeAMDModules : ['\.css$', 'require', 'modules', 'exports']
  //regexp to detect an AMD plugins, first we need to remove the plugin prefix to get a path
  , plugins      : ['^(text\/?)*!']
  //when name for dependency will resolved it will treat modules inside those folders as external
  , discoverable : ['bower_components', 'node_modules']
  , detectChangeIn : ['bower_components', 'node_modules', 'Gruntfile.js']
  //import namespaces, if you need to take some deps from exported namespace
  , imports: []
  //remap require calls, helpful when some libs have different reference to the same module
  , map: {}
  //js extensions, needed for filename.with.dots.js
  , jsExt: ['.js']
  //check existence of main/dir file when referencing a dir, like require('folder') = folder/index.js
  , dirExpanders: ['index.js']
  //when project is missing, inserting current folder as a prefix for modules
  , autoInsertFolder: true
  //format for escodegen
  , es6: false
  , reformatVars: true
  , sourceMap: true
  , format: {
      indent: { style: '  ', base: 2 },
      space: ' ',
      compact: false,
      safeConcatenation: false
    }
  , showWarnings: false
  , tempFolder: './.tmp'
  , autoCacheClean: false
  , development: true
  , version: require('../package.json').version
  , detectGlobals: true
  , buildInfo: true
  }

