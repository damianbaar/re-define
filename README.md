## re-define
Let's `re-define` something ...

`re-define` is able to resolve whole dependencies tree as well as single module.

from: `CommonJS`, `Plain JS`, `AMD` to: * ... yep custom templates are allowed.

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
    -s, --stream                Whether should read from stream
    -f, --follow [value]        Whether should resolve whole dep tree
    --separator [value]         Module separator while reading from stream
```

#### Examples

##### From stream
`echo "define('a',['b','c'],function(b, c){ console.log(b,c) })" | re-define --stream --wrapper iife`

```js
(function( b,c ){
  var a = function (b, c) {
    console.log(b, c);
  }(b, c);
 })( b,c )
```

`echo "var a = require('test'); var b = 10" | re-define --stream`

```js
(function(test, factory) {
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['test'], factory)
  } else {
    factory(test)
  }
}(test, function(test) {
  var s_1400445386970 = (function(r_1400445386975) {
    var a = r_1400445386975;
    var b = 10;
  })(test);
}));
```

##### From file
goto -> `cd example/demo`

`less main.js | re-define --stream`
or
`re-define -c build.config && less dist.js`

###Config
```js
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , verbose: false
  , wrapper: 'umd/amd-web'
  , dependencies: { 
      resolve: { 
        "^(text\/?)*!": "text",
        "^(css\/?)*!": "css",
        "pattern": "skip" 
      }
    , references: {
        //e.g. "jquery": "parent.$"
      }
  }
  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }

              /////////////////////
             // Available parts //
            /////////////////////

  , helpers: [join, escape, ref, append]
  , converter: [common_js, amd_define, amd_require]
  },
  , resolvers: [text, css, skip ],
  , wrappers: [iife, amd-define, umd/amd-web, umd/all }
  ] 
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
        "^(css\/?)*!": "skip:css",
        "^(domReady\/?)!": "skip"
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

### Advanced usage(todo)

####Instance
```js
var redefine = require('re-define')
  , config = redefine.config

  readStream
    .pipe(redefine.convert(config))
    .pipe(writeStream)
```

#### Custom converter
```js
converter: {
  common_js   : require('./converter/cjs')
, amd_define  : require('./converter/amd-define')
, amd_require : require('./converter/amd-require')
}
```

#### Custom wrapper
```js
wrappers: {
  'iife'        : file('./templates/iife.hbs')
, 'amd-define'  : file('./templates/amd-define.hbs')
, 'umd/amd-web' : file('./templates/amd-web.hbs')
, 'umd/all'     : file('./templates/return-exports-global.hbs')
}
```

#### Custom resolver
```js
resolvers: {
  text : require('.lib/resolver/file')
, css  : require('.lib/resolver/css')
, skip : require('.lib/resolver/skip')
}
```

#### Custom handlebars helper
```js
helpers: { 
  join   : function() { return _.toArray(arguments).join(',') }
, escape : function() { return _.map(arguments, function(d) { return config.escape(d) }) }
}
