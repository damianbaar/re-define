## re-define
Let's `re-define` something ...

`re-define` is able to resolve whole dependencies tree as well as single module.

from: `CommonJS`, `Plain JS`, `AMD`, `AMD CJS` to: * ... yep custom templates are allowed.

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [options]

  Options:

    -h, --help                  output usage information
    -v, --verbose               Verbose mode
    -c, --config [name]         Re-define config
    -w, --wrapper [type]        Wrapper type iife, empty, umd
    -b, --base [dir]            Base folder for project
    -m, --main [file]           Main file
    -o, --output [file]         Output
    -f, --follow [value]        Whether should resolve whole dep tree
    -r, --report                Bundle overview
    -s, --separator [value]     Module separator while reading from stream
```

#### Examples

##### From stream
`echo "define('a',['b','c'],function(b, c){ console.log(b,c) })" | re-define --wrapper iife`

```js
(function( b,c ){
  var a = function (b, c) {
    console.log(b, c);
  }(b, c);
 })( b,c )
```

`echo "var a = require('test'); var b = 10" | re-define

```js
(function(parent, factory) {
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['test'], factory)
  } else {
    var test = test

    factory(test)
  }
}(this, function(test) {
  var main = (function(r_0) {
    var a = r_0;
    var b = 10;
  })(test);

  return
}))
```

##### From file
goto -> `cd example/demo`

`less main.js | re-define`
or
`re-define -c build.config && less dist.js`

###Config
```js
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , verbose: false
  , wrapper: 'umd/4all'
  , dependencies: { 
      resolve: { 
        "^(text\/?)*!" : "text",
        "^(css\/?)*!"  : "css",
        "RegExp"       : "skip",
      }
    , references: {
        //e.g. "jquery": "parent.$"
      }
  }
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }

                      ///////////////
                     // Equipment //
                    ///////////////

  , helpers:   [ join, escape, ref, append]
  , converter: [ common_js, amd_define, amd_require]
  , resolvers: [ text, css, skip, include ],
  , wrappers:  [ iife, amd-define, umd/amd-web, umd/all] 
}
```

Example config:
```
  { "base": "lib"
  , "main": "main.js"
  , "output": "dist.js"
  , "wrapper": "umd/amd-web"
  , "name": "my-component"
  , "exports": "one"
  , "namespace": "ns"
  , "dependencies":
    { "resolve": {
        "^(css\/?)*!": "skip#css", //plugin#alias -> within template available via {{alias}}
        "^(domReady\/?)!": "skip",
        "jquery"       : "include#path_relative_to_base"
      }
      , "references": {
        "jquery": "parent.$"
      , "dep/dep": "parent['ns'].dep"
      }
    }
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
0.0.14
- [x] `colors` not included in package.json
- [x] `--stream` flag is no longer needed

0.0.13
- [x] resolver - include#path - pull in external js files
- [x] deps reports - re-define --report

0.0.12
- [x] converter - amd commonjs - define(function(req, mod, exp) {})

#### TODO
- [ ] resolver - for resolving nested external deps
- [ ] increase test coverage
- [ ] follow fix - when not following do not resolve plugin
- [ ] switch to acorn
- [ ] removing debugger/console.log statements
- [ ] grunt task
- [ ] gulp support

### Advanced usage

####Instance
```js
var redefine = require('re-define')
  , myConfig = {}
  , config = redefine.config(myConfig)

  readStream
    .pipe(redefine.convert(config))
    .pipe(writeStream)
```

#### Custom converter (todo)
```js
converter: {
  common_js   : require('./lib/converter/cjs')
, amd_cjs: require('./converter/amd-cjs')
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

#### Custom resolver (todo) 
```js
resolvers: {
  text : require('./lib/resolver/file')
, css  : require('./lib/resolver/css')
, skip : require('./lib/resolver/skip')
, include: require('./resolver/include')
}
```

#### Custom handlebars helper (todo)
```js
helpers: { 
  join   : function() { return _.toArray(arguments).join(',') }
, escape : function() { return _.map(arguments, function(d) { return config.escape(d) })}
}
```
