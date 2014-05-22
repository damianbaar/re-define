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
        "^(css\/?)*!": "skip"
      }
    , references: {
        //e.g. "jquery": "parent.$"
      }
  }

                          //////////////////
                         //Advanced usage//
                        //////////////////

  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , helpers: { [join, escape, ref, append] }
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
      'iife'        : file('./templates/iife.hbs')
    , 'amd-define'  : file('./templates/amd-define.hbs')
    , 'umd/amd-web' : file('./templates/amd-web.hbs')
    , 'umd/all'     : file('./templates/return-exports-global.hbs')
    }
  }
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
      , "exports": "parent['ns']"
      , "dep/dep": "parent['ns'].dep"
      }
    }
  }
```

Example wrapper:
```
{{#if css }}//css       -> {{css}}  {{/if}}
{{#if external}}//ext   -> {{external}} {{/if}}
{{#if skip}}//skip      -> {{skip}} {{/if}}

(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('{{{name}}}', [{{{seq join quotes external css}}}], factory)
   } else {
    {{#each external}}var {{seq ../escape this}} = {{{seq ../remap this}}}
    {{/each}}

    parent['{{{seq remap exports}}}'] = factory({{{seq escape external}}})
  }
}(this, function ({{{seq escape external}}}) {
  {{{code}}}

  return {{{exports}}}
}));
```

### Extend
#### Custom converter
#### Custom wrapper
#### Custom resolver
#### Custom helper
