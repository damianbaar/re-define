module.exports = 
  { names         : {amd: 'amd/name', global: 'global.name'}
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
  , wrapper       : 'default'
  //attach all bundled modules to namespace, foo.baz.bar is allowed
  , namespace: '' 
  //needed for correct alignment module names
  , alignToFolder: ['node_modules', 'bower_components']
  //exclude specific AMD dependencies
  , excludeAMDModules : ['\.css$', 'require', 'modules', 'exports']
  //regexp to detect an AMD plugins, first we need to remove the plugin prefix to get a path
  , plugins      : ['^(text\/?)*!']
  //import namespaces, if you need to take some deps from globals like jquery, define it as ['window']
  , imports: []
  //remap require calls, helpful when some libs have different reference to the same module
  , map: {}
  //js extensions, needed for filename.with.dots.js
  , jsExt: ['.js']
  //export __filename, __dirname
  , exportPaths: true
  //format for escodegen
  , format: {
      indent: { style: '  ', base: 2 },
      space: ' ',
      compact: false,
      safeConcatenation: false
    }
  , showWarnings: false
  , tempFolder: './.tmp'
  }

