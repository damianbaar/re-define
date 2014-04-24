## re-define
Convert anything to anything.

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [options]

  Options:

    -h, --help                  output usage information
    -v, --verbose               Verbose mode
    -c, --config [name]         Re-define config
    -i, --input [code/file]     Arbitrary code
    -w, --wrapper [iife/empty]  Wrapper type
    -b, --base [dir]            Base folder for project, i.e. .
    -m, --main [file]           Main file
    -o, --output [file]         Output
```

#### Examples

##### From stream
`re-define -w empty -i "define('a',['jquery','underscore'], function($,_) { console.log($, _) })"`

```
var a = function ($, _) {
  console.log($, _);
}(jquery, underscore);
```

`re-define -w iife -i "define('a',['jquery','underscore'], function($,_) { console.log($, _) })" `
```
(function(jquery,underscore){
  var a = function ($, _) {
    console.log($, _);
  }(jquery, underscore);
})(jquery,underscore)
```

##### From file
`re-define -m example/demo/main.js -o test.js -b . -v`

or

`cd example/demo && re-define -c build.config`

###Config
```
{ base: '.'
, main: ''
, out: ''
, namespace: 'ns'
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
, wrappers: {
  'empty': require('./wrapper/empty')
, 'iife': require('./wrapper/iife')
, 'amd-define': require('./wrapper/amd-define')
}
, formatter: { format: {indent: {style: '  ', base: 0}, space: ' '}}
}
```