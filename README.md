## re-define (work in progress)
A command line tool for resolving and converting modules tree.
Currently supports only `AMD` and output could be presented as `UMD`, `IIFE`, `Plain JS` or `AMD define` module.

TODO:

[] resolving `Plain JS`, `CommonJS`


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
  , wrapper: {
    type: 'empty'
    // , ref: { 'dep_name': 'reference i.e. ns[component]'}
    }
  , dependencies: { 
    // { resolve: { '/(text\/?)*\!/': 'file or skip or ...' }
    }

                          //////////////////
                         //Advanced usage//
                        //////////////////

  , escape: function (val) { return val.replace(/\.|\/|\\|-/g, '_') }
  , format: {format: {indent: {style: '  ', base: 4}, space: ' '}}
  , converters: { }
  , resolvers: { }
  , wrappers: { }
  }
```

### Extend
#### Custom converter
#### Custom wrapper
#### Custom mixin
