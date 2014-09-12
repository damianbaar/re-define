## re-define
Let's `re-define` something ... without any configuration ... just do the magic for me, yet another build tool.

Easy way to convert your AMD and CommonJS projects for WEB.

### Nice things
* require function allows to reference different `namespaces`
* all modules are wrapped in cjs wrapper `function(exports, require, module, __filename, __dirname)`
* ability to split bundles based on `glob`, to extract common parts
* when piping passing `vinyl` files (integration with gulp)
* automatically loads configuration from file `re-define.json`
* handling glob pattern
* for external deps (outside the lib or those which live in node_modules/bower_components) checks descriptor files, such as `bower.json` or `package.json`, there is also a fallback to `node_modules` as well as `bower_components` when descriptor is missing or there is no `main` defined, check `re-define-include-external` to get more details
* `re-define` make names for module appropriatelty to folder structure and expose it within given namespace which could be referenced further from any other different module, this is:
assuming your module is placed in folder `my_awesome_component` all internal modules are presented as `my_awesome_component/**`. (check tests to get more [info](test/transforms/rewrite-require_test.js)

### Why
* to provide better support for `amd`
* to share code and expose more than one module within namespace and import from others
* to be able to handle all modern js build systems in one
* to generating templates tailored to your needs with all relevant information, i.e. external dependencies

### TODO
* incremental builds
* generating `sourcemaps`

### Limitation
* does not resolve circular dependencies
* resolve only static `require` statements

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [file/files or glob pattern] -[options]

Options:
```
    '-b, --base [dir]'            , 'Base dir'
    '-o, --output [dir or file]'  , 'Output, when defined saving to appropriate files'
    '-t, --transforms [libs]'     , 'Attach transform streams'

    '-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"'
    '-m, --map-deps [deps]'       , 'Remap dependency name (require call)'
    '--namespace [a.b.c.d]'       , 'Namespace for bundle'
    '--imports [namespaces]'      , 'Import namespaces'

    '-g, --globals [module#as]'   , 'Map externals to global - jquery#this.jquery'
    '-n, --names [json]'          , 'Register names for AMD/Global, i.e {amd:"sth",global:"sth.sth"}'
    '-r, --returns [module]'      , 'Return module'
    '-w, --wrapper [type]'        , 'Wrapper type umd'

    '--external [json]'           , 'External modules'
    '--discoverable [dirs]'       , 'External modules lib, such bower_components'
    '--descriptors [files]'       , 'Checking main file in external dep'
    '--skip [module]'             , 'Skip external module'
```


#### Debbuging
To run `re-define` in debug mode, just run `DEBUG=re-define:* re-define` 

###Config
```js
module.exports = 
  { names         : {amd: 'amd/name', global: 'global.name'}
  , returns       : ''
  , globals      : [] //external module_name#global_ref

  //define cutting points for modules { glob_pattern: file }
  , slice         : {"**/**": "bundle.js"}
  //could be a folder (in case of many files) or just file, when not defined print output to console
  , output        : ''
  //base folder, all modules will be aligned to that
  , base          : '.'
  //wrapper file 
  , wrapper       : 'default'
  //attach all bundled modules to namespace
  , namespace: "your.namespace"
  //exclude specific AMD dependencies
  , excludeAMDModules : ['\.css$', 'require', 'modules', 'exports']
  //regexp to detect an AMD plugins, first we need to remove the plugin prefix to get a path
  , plugins      : ['^(text\/?)*!']
  //import namespaces, if you need to take some deps from globals like jquery, define it as ['window']
  , imports: []
  //remap require calls, helpful when some libs have different reference to the same module
  , map: {}
  //format for escodegen
  , format: {
      indent: { style: '  ', base: 2 },
      space: ' ',
      safeConcatenation:true 
    }
  }

```

####Custom transforms
* [usage](/bin/re-define.js#L58)
* [example](https://github.com/damianbaar/re-define-include-external)

####Compilation time 
Some results could be found [here](/examples/real-libs).
