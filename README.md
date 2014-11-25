## `<script src='re-define.js' />`
Let's `re-define` something ... without any configuration ... just do the magic for me, yet another build tool.

Easy way to pack your application source files into one file(s) in order to build a bundle(s) you can use in `<scipt>` tag. `re-define` checks recursively `require` calls and could be used either to AMD or CommonJS files, since all AMD modules are converted into CJS.

Check [examples](/examples) to get better picture.

### Some differences, nice things in `re-define`
* works well with `bower` and `npm`
* incremental builds (enable `--development` flag)
* connects javascript chunks in better organized code via namspaces
* has a fallback to external require function, works with `requirejs`, `browserify`
* exposing internal parts, makes flat folder structure for module name, all names are aligned to theirs cwd/base paths, so you can easly require internal part of lib as you get used to it with npm
* when dependency is missing then is treated as external without shouting, helpful when you'd like to keep some rarely changing parts in separation

### What is inside
* require function allows to reference different `namespaces`
* all modules are wrapped in cjs wrapper `function(exports, require, module, __filename, __dirname)`
* ability to split bundles using `glob`, to extract common parts based on folder
* when piping passing `vinyl` files (integration with gulp)
* automatically loads configuration from file `re-define.json`
* handling glob pattern as an input
* for external deps (outside the base folder or those which live in node_modules/bower_components) it checks descriptor files, such as `bower.json` or `package.json`, if there is no descriptor it is trying to match file with requested dep name, check [re-define-include-external](https://github.com/damianbaar/re-define-include-external) to get more details
* `re-define` make names for module appropriatelty to folder structure and expose it within given namespace which could be referenced further from any other different module, this is:
assuming your module is placed in folder `my_awesome_component` all internal modules are presented as `my_awesome_component/**`. (check tests to get more [info](test/transform/rewrite-require_test.js))

### Why
* to provide better support for `amd`
* to share code and expose more than one module within namespace and import it from others
* to to handle `amd` and `CJS` togheter

### TODO
* generating `sourcemaps`
* separate namespace for bundles when slicing

### Limitation
* resolve only static `require` statements (thinking)

### Getting Started
Install the module: `npm install -g re-define`

###Usage
#### command line
```
re-define [file/files or glob pattern] -[options]
```

Options:
```
'-b, --base [dir]'            , 'Base dir'
'-o, --output [dir or file]'  , 'Output, when defined saving to appropriate files'
'-t, --transforms [libs]'     , 'Attach transform streams'

'-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"'
'-m, --map-deps [deps]'       , 'Remap dependency name (require call)'
'--namespace [a.b.c.d]'       , 'Namespace for bundle'
'--imports [namespaces]'      , 'Import namespaces'

'-g, --globals [json]'        , 'Map require external calls to global - {jquery:this.jquery}'
'-n, --names [json]'          , 'Register names for AMD/Global, i.e {amd:"sth",global:"sth.sth"}'
'-r, --returns [file/module]' , 'Return module, could be specified as file or resolved module'
'-w, --wrapper [type]'        , 'Wrapper type umd'
'-p, --project-name [name]'   , 'Project name, it becomes prefix for your internal modules name'

'--development'               , 'Development mode'
'--external [json]'           , 'Include module from external location {lib:path}')
'--discoverable [dirs]'       , 'External modules lib, such bower_components'
'--descriptors [files]'       , 'Checking main file in external dep descriptor'
'--skip [module]'             , 'Skip external module'
```

#### as stream
```js
  //with single entry point
  redefine
    .fromFile( entryPoint
             , { 'project-name': 'components'
               , wrapper: 'browserify' }
             , [ includeExternal({})
               , reactify({}) ]
             )
    .pipe(res)

  //many entry points
  var bundle = redefine.bundle(redefine.config(), transforms)

  bundle.pipe(process.stdout)

  bundle.write(
    new File({
          path: e
        , cwd: (config.cwd && path.resolve(config.cwd)) || process.cwd()
        , base: path.dirname(e)
        }))
```

###Config
```js
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
  //check existence of main/dir file when referencing a dir, like require('folder') = folder/index.js
  , dirExpanders: ['index.js', 'main.js']
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
  , autoCacheClean: false
  , development: true
  }
```

* `globals`
internally we require('jquery'), however jquery is only accessible via global, so to remap jquery to global.$ we need to set a mapping, like
```
globals: {'jquery': '$'}
```
this property matters only with following templates: `iife`, `umd`, `browserify`

* `autoCacheClean` && `development`
when development mode is enabled `re-define` creates a `.tmp` folder where stores resolved files to speed up compilation time, however when `autoCacheClean` flag is enabled, then is removing old entries, for the time being it is not well optimized and there is a noticable performance impact

###How it works
####Imports
```
//create namespace for components
re-define lookup.js --namespace org.component

//import it to make it accessible for your code 
re-define index.js --imports this.org.component --namespace org.site
```
To get more, check this [example](/examples/imports)

####Custom transforms
* [usage](/bin/re-define.js#L56) or [grunt](https://github.com/damianbaar/grunt-re-define)
* [example](https://github.com/damianbaar/re-define-include-external)
* [setting an order for file streams](https://github.com/damianbaar/re-define-wrap)

```js
module.exports = function(yourConfig) {
  var stream = function streamName(globalConfig) {
    return through2.obj(function(file, enc, next) {})
  }

  stream.order = `after`
  
  return stream
}
//if you give a name to your function then you can attach config within the global one, this is { streamName: myConfig }
```

> when order for stream `stream.order = after` then `file.contents = AST`

####Available transforms
* [find-external](https://github.com/damianbaar/re-define-include-external)
* [react](https://github.com/damianbaar/re-define-react)
* [wrap file](https://github.com/damianbaar/re-define-wrap)

####Compilation time 
Some results could be found [here](/examples/real-libs).

#### Debbuging
To run `re-define` in debug mode, just run `DEBUG=re-define:* re-define` 

#### File watcher
There is no embeded watcher for files. In development mode `re-define` creates cache with resolved files so after second run checks against existency within temp and resolves again those which are fresh. 
Watching with `nodemon --ignore bundle.js --exec 're-define index.js --development --output bundle.js'`
