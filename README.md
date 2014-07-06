## re-define
Let's `re-define` something ... without any configuration ... just do the magic for me.

Easy way to convert AMD and CommonJS projects to one plain javascript bundle wrapped in `UMD`.

### Why
* to get decent encapsulation, registering a bundle not a part
* to make project compatibile across node and web without effort

### Features
* highly customizable: templates, transforms (like with browserify), discoverable folders
* now also resolving modules dependencies
* looking for dependencies in `node_modules` and `bower_components`
* resolving whole dependencies trees as well as single file
* handlebars for templating with custom helpers
* resolving AMD !text plugin within `cjs` and `amd` code
* using `vinyl`, integration with `gulp` should be easy
* (WiP) detailed report, to get whole picture, display modules, dependencies and externals

### Limitation
* does not resolve circular dependencies

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [options]

Options:
  '-t, --transform [libs]'      , 'Custom transforms stream invoked for each module'
  '-m, --main [filepath]'       , 'Main file'
  '-b, --base [dir]'            , 'CWD'
  '-e, --external [json]'       , 'Exact dep locations, when discoverable is not enough'
  '-g, --globals [module#as]'   , 'Global reference to external libs'
  '-w, --wrapper [type]'        , 'Wrapper type report, default: umd'
  '-n, --name [module]'         , 'Module name'
  '-r, --returns [module]'      , 'What module returns'
  '-e, --exclude-deps [deps]'   , 'Exclude deps'
```

#### Example usage
check [example folder](example) and appropriate build files

#### Debbuging
To run `re-define` in debug mode is fairly easy, just run `re-define` with appropriate category like below

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
  { cwd          : '.'
  , name         : 'module_name'
  , wrapper      : 'umd'
  , returns      : ''
  , excludeDeps  : ['\.css$', 'require', 'modules', 'exports']
  , globals      : [] //external module_name#global_ref
  , external     : {} //{"jquery": "location"} or {"..": "{path: "...", cwd: "..."}
  , discoverable : ['node_modules', 'bower_component']
  , descriptors  : ['package.json', 'bower.json']
  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!'}]
  , escape       : function (val) { return val.replace(/\.\/|\!|\.|\/|\\|-/g, '_') }
  , scopeVar     : '_scope_'
  , internalRequire : 'require'
  }
```

Example wrapper:
```
(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('{{{config.name}}}', [{{{chain external map '\'|\'' reduce}}}], factory)
  } else if (typeof exports === 'object') {
  module.exports = factory({{{chain external map 'require(\'|\')' reduce}}})
  } else {
    {{#each external}}var {{{escape this}}} = {{{global this}}}
    {{/each}}
    {{#if config.returns}}parent['{{{config.name}}}'] = {{/if}}factory({{{chain external escape}}})
  }
  }(this, function ({{{chain external escape}}}) {
  {{{chain external escape map 'this.| = |'}}}

  {{#each bundles}}
  {{#if this.wrap}} 
  (function() {
    var {{{../../config.scopeVar}}} = {}
    {{{this.code}}}
    function {{{../../config.internalRequire}}} (name) { return this[name] || {{{../../config.scopeVar}}}[name] }
  }).call(this);
  {{else}} {{{this.code}}} {{/if}} {{/each}}

  {{#if config.returns }} return this.{{{config.returns}}} {{/if}}
}))
```

####Custom transform
```js
var through = require('through2')

module.exports = function(config) {

  //config instance

  return through.obj(function(file, enc, next) {
    /* 
    //inside of file you can find following properties
    {
      "cwd": "lib",
      "base": "lib",
      "path": "./lib/main.js",
      "ext": ".js",
      "type": "require",
      "ast" : ...
      "contents" : ...
      "deps": [
        {
          "path": "jquery",
          "require": "jquery"
        }
        ...
      ]
    */

    //your own spells

    this.push(file)
    next()
  })
}
```
