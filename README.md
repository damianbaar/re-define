## re-define (work in progress)
A command line tool for resolving and converting modules tree.
Currently supports `AMD` and output could be presented as `UMD`, `IIFE`, `Plain JS` or `AMD define` module.

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
    -f, --follow [value]        Whether should resolve whole dependency tree
    -s, --stream                Whether should read from stream
```

#### Examples

##### From stream
`echo "define('a',['b','c'],function(b, c){ console.log(b,c) })" | re-define --stream --wrapper iife`

```
(function( b,c ){
  var a = function (b, c) {
    console.log(b, c);
  }(b, c);
 })( b,c )
```

##### From file
goto -> `cd example/demo`

`less main.js | re-define --stream`
or
`re-define -c build.config && less dist.js`

####Config
```
  { base: '.'
  , main: ''
  , out: ''
  , name: 'module_name'
  , follow: true
  , verbose: false
  , wrapper: 'empty'
  , dependencies: { 
     { resolve: { 'pattern': 'resolver' }
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
    , remove: require('./lib/resolver/remove')
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
      { "^(text\/?)*!": "text",
        "^(css\/?)*!": "css",
        "^(domReady\/?)!": "skip"
      }
      , "references": {
        "jquery": "$"
      , "export": "this"
      }
    }
  }
```

Exaple wrapper:
```
{{#if css }}//css   -> {{css}}  {{/if}}
{{#if deps}}//ext   -> {{deps}} {{/if}}
{{#if args}}//remap -> {{deps}} -> {{args}} {{/if}}
{{#if skip}}//skip  -> {{skip}} {{/if}}
//namespace -> {{config.namespace}}

(function ({{sequence join deps factory}}) {
  if (typeof define === 'function' && define.amd) {
    define('{{{name}}}', [{{#sequence join escape deps css}}{{/sequence}}], factory)
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
