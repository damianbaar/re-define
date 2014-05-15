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
    // { resolve: { '/(text\/?)*\!/': 'file or skip or ...' }
    }

                          //////////////////
                         //Advanced usage//
                        //////////////////

  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , format: { format: {indent: {style: '  ', base: 2}, space: ' '}}
  , converters: {
      amd_define:  {
        resolver: require('./converter/amd-define-resolver')
      , transformer: require('./converter/amd-define-transformer')
      }
      , amd_require: {
        resolver: require('./converter/amd-require-resolver')
      , transformer: require('./converter/amd-require-transformer')
      }
    }
  , resolvers: {
        text: require('./resolver/file')
      , css: require('./resolver/css')
      , skip: require('./resolver/skip')
    },
    , wrappers: {
        'iife'        : file('./templates/iife.template')
      , 'amd-define'  : file('./templates/amd-define.template')
      , 'umd/amd-web' : file('./templates/amd-web.template')
      , 'empty'       : require('./wrapper/empty')
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
        "jquery": "external['jquery']"
      }
    }
  }
```

### Extend
#### Custom converter
#### Custom wrapper
#### Custom mixin
