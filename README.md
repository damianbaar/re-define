## re-define
Let's `re-define` something ...

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
```
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , verbose: false
  , wrapper: 'umd/amd-web'
  , dependencies: { 
      resolve: { 
        "^(text\/?)*!": "text",
        "^(css\/?)*!": "skip"
      }
  }

                          //////////////////
                         //Advanced usage//
                        //////////////////

  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , helpers: { 
      escape: function() { return _.map(arguments, function(i) { return '\'' + i + '\'' }) }
    , join: function() { return _.toArray(arguments).join(',') } 
  }
  converter: {
    common_js: require('./converter/cjs')
  , amd_define: require('./converter/amd-define')
  , amd_require: require('./converter/amd-require')
  },
  , resolvers: {
      text: require('.lib/resolver/file')
    , css: require('.lib/resolver/css')
    , skip: require('.lib/resolver/skip')
  },
  , wrappers: {
      'iife'        : file('./templates/iife.template')
    , 'amd-define'  : file('./templates/amd-define.template')
    , 'umd/amd-web' : file('./templates/amd-web.template')
    }
  }
}
```

Example config:
```
  { "main": "main.js"
  , "output": "dist.js"
  , "wrapper": "iife"
  , "name": "my-component"
  , "dependencies":
    { "resolve": 
      { "^(domReady\/?)!": "skip"
      }
      , "references": {
        "jquery": "$"
      , "export": "this"
      }
    }
  }
```

Example wrapper:
```
{{#if css }}//css   -> {{css}}  {{/if}}
{{#if deps}}//ext   -> {{deps}} {{/if}}
{{#if args}}//remap -> {{deps}} -> {{args}} {{/if}}
{{#if skip}}//skip  -> {{skip}} {{/if}}
//namespace -> {{config.namespace}}

(function ({{sequence join deps 'factory'}}) {
  if (typeof define === 'function' && define.amd) {
    define('{{{name}}}', [{{sequence join escape deps css}}], factory)
   } else {
    factory({{deps}})
  }
}({{args}}, function ({{deps}}) {
  {{{code}}}
}));
```

### Extend
#### Custom converter
#### Custom wrapper
#### Custom resolver
#### Custom helper
