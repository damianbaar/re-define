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

### Limitation
* does not resolve circular dependencies

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
    '-m, --map [module#as]'       , 'Map externals to global - jquery#this.jquery'
    '-i, --include [filePath#as]' , 'Include external file, filepath#external_dep'
    '-e, --exclude-deps [deps]'   , 'Ignore deps - ".css"'
    '-f, --file-filter'           , 'Glob pattern for files and folders'
```

#### Example usage
```
//0 configuration
re-define 
```

glob patterns (comma separated) 
```
re-define './**/*.+(js),!./**/+(node_modules|bower_components)/**/*.*'
```

when piping 
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
    define('{{{name}}}', [{{{chain external map '\'|\'' reduce}}}], factory)
  } else if (typeof exports === 'object') {
  module.exports = factory({{{chain external map 'require(\'|\')' reduce}}})
  } else {
    {{#each external}}var {{{escape this}}} = {{{global this}}}
    {{/each}}
    //included {{included}}
    {{#if return}}parent['{{{name}}}'] = {{/if}}factory({{{chain external escape}}})
  }
  }(this, function ({{{chain external escape}}}) {

  {{{code}}}
  return {{{returns}}}
}))
```

### API (todo)
* from path
* from stream
