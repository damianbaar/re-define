## re-define
Let's `re-define` something ... without any configuration ... just do the magic for me.

Easy way to convert AMD and CommonJS projects to one plain javascript file.

### Why
* to get decent encapsulation, registering a bundle not a part
* to make project compatibile across node and web without effort
* in most cases we can live without `requirejs`, however for web development is pretty neat

### Features
* resolving whole dependencies trees as well as single file
* 0 configuration, just run `re-define` and that's all
* detailed report, to get whole picture, display modules, dependencies and externals
* highly customizable, custom templates, 6 are already included, you can even create custom 're-define', just connect the dots based on streams available via API
* handlebars for templating with custom helpers
* templates included: 'umd/4all', 'report' , 'umd/amd-web', 'iife', 'amd-define',  'empty'
* resolving AMD !text plugin
* matching files using glob (default argument)

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [options]

Options:
    '-c, --config [name]'         , 'Re-define config'
    '-w, --wrapper [type]'        , 'Wrapper type report, iife, empty , umd'
    '-b, --base [dir]'            , 'Base folder for project'
    '-n, --name [module]'         , 'AMD module name'
    '-r, --return [module]'       , 'Export module'
    '--file-filter'               , 'Glob pattern for files and folders'
    '--exclude-deps [deps]'       , 'Ignore deps - ".css"', toArray
    '--externals [module#as]'     , 'Map externals to global - jquery#this.jquery', toArray
```

#### Example usage
```
//0 configuration
re-define 
```

* glob patterns (comma separated) 
```
re-define './**/*.+(js),!./**/+(node_modules|bower_components)/**/*.*'
```

* when piping 
(note: for piping mode, built in filters for folders and files are disabled)

```
find . -type f -name '*js' | re-define
```

#### Debbuging
To run `re-define` in debug mode (thanks to `debug`) is fairly easy, just run `re-define` with appropriate category like below

```
//all
DEBUG=re-define:* 

//specific:
re-define:transform:* 
re-define:converter
re-define:bin
```

###Config
```js
  { base         : '.'
  , name         : 'module_name'
  , wrapper      : 'umd/4all'
  , debug        : false
  , return       : ''
  , fileFilter   : ["./**/*.+(js|html)", "!./**/+(bin|test|node_modules|bower_components)/**/*.*"]
  , excludeDeps  : ['\.css$']
  , includeFiles : [] //filepath#alias, alias = module.name
  , externals    : [] //external module_name#global_ref
  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!', prefix : 'txt_'}]
  , escape       : function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
```

Example wrapper:
```
(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('{{{name}}}', [{{{seq join append '\'|\'' external css}}}], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory({{{seq join '#require(|)' append '\'|\'' append external}}})
  } else {
    {{#each external}}var {{seq ../escape this}} = {{{seq ../ref this}}}
    {{/each}}
    {{#if exports}}parent['{{{seq ref exports}}}'] = {{/if}}factory({{{seq escape external}}})
  }
}(this, function ({{{seq escape external}}}) {
  {{{code}}}

  return {{{exports}}}
}));
```
### Release notes
0.0.16-beta (breaking changes)
- [x] switched to streams
- [x] more flexible integration with command line

```
find . -type f | re-define --return main | esformatter
```

``` 
//(builtin dir traversing)
re-define --return deps/four --include '../external/jquery.js#jquery'
```

- [x] traversing directories instead of checking what is inside module
- [x] when piping - input should be empty or file paths

0.0.16
- [x] more flexible file traversing (no more main file, shims or other odd things)
- [x] using streams instead of `async`
- [x] easier to follow code
- [x] switched to acorn
- [x] changed API

0.0.15
- [x] minor `cli` improvements `re-define build.config`

0.0.14
- [x] `colors` not included in package.json
- [x] `--stream` flag is no longer needed

0.0.13
- [x] resolver - include#path - pull in external js files
- [x] deps reports - re-define --report

0.0.12
- [x] converter - amd commonjs - define(function(req, mod, exp) {})

#### TODO
- [ ] report with d3 charts
- [ ] increase test coverage
- [ ] removing debugger/console.log statements
- [ ] grunt task
- [ ] gulp support

### Advanced usage

####Instance
```js
var redefine = require('re-define')
  , myConfig = {}
  , config = redefine.config(myConfig)

  readStream (file paths or you can just write to redefine)
    .pipe(redefine.convert(config))
    .pipe(writeStream)
```

#### Custom converter (todo)
```js
converter: {
  common_js   : require('./lib/converter/cjs')
, amd_cjs     : require('./lib/converter/amd-cjs')
, amd_define  : require('./lib/converter/amd-define')
, amd_require : require('./lib/converter/amd-require')
}
```

#### Custom wrapper (todo) 
```js
wrappers: {
  'iife'        : file('./lib/templates/iife.hbs')
, 'amd-define'  : file('./lib/templates/amd-define.hbs')
, 'umd/amd-web' : file('./lib/templates/amd-web.hbs')
, 'umd/all'     : file('./lib/templates/return-exports-global.hbs')
}
```

#### Custom handlebars helper (todo)
```js
helpers: { 
  join   : function() { return _.toArray(arguments).join(',') }
, escape : function() { return _.map(arguments, function(d) { return config.escape(d) })}
}
```

#### Interceptors
