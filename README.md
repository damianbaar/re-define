## re-define
Let's `re-define` something ... without any configuration ... just do the magic.

`re-define` is able to resolve whole dependencies tree as well as single module.

from: `CommonJS`, `Plain JS`, `AMD`, `AMD CJS` to: * ... yep custom templates are allowed.

[![Build Status](https://travis-ci.org/damianbaar/re-define.svg?branch=master)](https://travis-ci.org/damianbaar/re-define)

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [options]

Options:

  '-c  , --config [name]'          , 'Re-define config'
  '-w  , --wrapper [type]'         , 'Wrapper type iife, empty , umd'
  '-b  , --base [dir]'             , 'Base folder for project'
  '-n  , --name [module name]'     , 'AMD module name'
  '-r  , --return [module name]'   , 'Export module'
  '-r  , --report'                 , 'Bundle overview'
  '-i  , --include [file#as]'      , 'Include external files'
  '-e  , --external [module#as]'   , 'Parent access to external lib - jquery#this.jquery')
  '-f  , --skip-folders [folders]' , 'Ignore folders i.e. a, b, c, d'
  '-d  , --skip-deps [deps]'       , 'Ignore folders i.e. ".css"'
```

#### Example usage
```
//0 configuration
re-define 
```

* in case you've got a mess within your project

```
find . -type f -name '*js' | re-define --return main -e 'jquery#this.jquery,deps_template#this.deps.template'
```

###Config
```js
  { base: '.'
  , name: 'module_name'
  , wrapper: 'umd/4all'
  , skipFolders: ['.git', 'node_modules', 'bower_components']
  , includeTypes: ['.html', '.js']
  , skipDeps: [/\.css/]
  , include: [] //filepath#alias, alias = module.name
  , external: [] //external-module.name#global_ref

                      ///////////////
                     // Equipment //
                    ///////////////

  , converter: [ common_js, amd_define, amd_require, amd_cjs ]
  , wrappers:  [ iife, amd-define, umd/amd-web, umd/4all ] 
}
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

``` (with builtin dir traversing)
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
