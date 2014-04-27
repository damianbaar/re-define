## re-define (work in progress)
A command line tool for resolving and converting dependency tree for `AMD` projects.
Currently works for `AMD` to `Plain JS` or `AMD` define module.

`CommonJS`, `UMD` will be implemented soon.

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
to check those commands -> `cd example/demo`

`less main.js | re-define --stream`
or
`re-define -c build.config && less dist.js`

###Advanced usage
####Config
```
{ base: '.'
, main: ''
, out: ''
, wrapper: 'empty'
, converters: {
  'amd-define':  {
    resolver: require('./converter/amd-define-resolver')
  , transformer: require('./converter/amd-define-transformer')
  }
  , 'amd-require': {
    resolver: require('./converter/amd-require-resolver')
  , transformer: require('./converter/amd-require-transformer')
  }
}
, mixins: [
  { pattern : /text!/, resolver: require('./converter/plugin/file') }
]
, wrappers: {
  'empty': require('./wrapper/empty')
, 'iife': require('./wrapper/iife')
, 'amd-define': require('./wrapper/amd-define')
}
, formatter: { format: {indent: {style: '  ', base: 0}, space: ' '}}
}
```

### Extend
#### Custom converter
#### Custom wrapper
#### Custom mixin