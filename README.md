## re-define
Let's `re-define` something ... without any configuration ... just do the magic for me, yet another build tool.

Easy way to convert AMD and CommonJS projects to one bundle wrapped in `UMD`.

### Why
* to get decent encapsulation, registering a bundle not a part
* to make project compatibile across node and web without effort
* to provide better support for `amd` projects

### Features
* highly customizable: templates, transforms (like with browserify)
* looking for dependencies in `node_modules` and `bower_components`
* resolving whole dependencies trees as well as single file
* resolving AMD !text plugin within `cjs` and `amd` code
* extends `vinyl` to keep contents in (file.contents) as AST, parse js file once and play with ast instead of content -> AST -> content 
* (WiP) detailed report, to get whole picture, display modules, dependencies and externals

### Nice things
* when `re-define` meet external dep, automatically checks descriptor files, such as `bower.json` and `package.json`, there is also a fallback to `node_modules` as well as `bower_components` when descriptor is missing or there is no `main` defined
* when including an `UMD` file as a dep and your `define` module is anonymous, `re-define` will add a name for you also check internal depenencies

### Limitation
* does not resolve circular dependencies
* `module.export` override `exports` when defined below exports
* resolve only static `require` statements

### Getting Started
Install the module: `npm install -g re-define`

###Usage
```
Usage: re-define [entry-point] -[options]

Options:
  '-t, --transform [libs]'      , 'Custom transforms stream invoked for each module'
  '-m, --main [filepath]'       , 'Main file'
  '-b, --base [dir]'            , 'CWD'
  '-d, --discoverable [dirs]'   , 'Check in folders when encouter an external dep'
  '-e, --external [json]'       , 'Exact dep locations, when discoverable is not enough'
  '-g, --globals [module#as]'   , 'Global reference to external libs'
  '-w, --wrapper [type]'        , 'Wrapper type report, default: umd'
  '-n, --name [module]'         , 'Module name'
  '-r, --returns [module]'      , 'What module returns'
  '-s, --skip [modules]'        , 'Exclude external modules from bundle'
  '-e, --exclude-deps [deps]'   , 'Exclude deps'
```


Configuration examples:

* externals
`--external {"lodash":{"stopProcessing":true, "path": "./vendor/lodash.js", "deps": ["jquery"]}}` or `{"lodash":"./vendor.lodash.js"}`

* globals
`--globals "async#parent.async"`

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
  , excludeDepRef  : ['\.css$', 'require', 'modules', 'exports']
  , globals      : [] //external module_name#global_ref
  , plugins      : [{extension: '.html', pattern : '^(text\/?)*!'}]
  , escape       : function (val) { return val.replace(/\.\/|\!|\.|\/|\\|-/g, '_') }
  , discoverable : ['node_modules', 'bower_component']
  , descriptors  : ['package.json', 'bower.json']
  , external     : {} //{"jquery": "location"} or {"..": "{path: "...", cwd: "..."}
  }
```

####Custom transforms
* [example](/lib/transform/find-external.js) 
* [usage](/bin/re-define.js#L39)

```js
var through = require('through2')

module.exports = function(config) {
  return function(globalConfig, writer) {
    return through.obj(function(module, enc, next) {
      /* //inside of module you can find following properties
        { "paths": [
         "example/lib/view/type.js"
        ],
          "parent": "main",
          "base": "lib",
          "cwd": "re-define/example",
          "ext": ".js",
          "name": "view/type.js",
          "reference": "view/type.js",
          "isAST": "method"
        }
      */

      //your own spells

      this.push(file)
      next()
    })
  }
}
```
