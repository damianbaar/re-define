## reason
All AMD modules (soon CommonJS) are resolved into one, clean javascript file.
This is not a clone of AMDClean. Way of resolving RequireJS modules is pretty much the same, however there are some differences ... will post latter about that.

### Why
* to get decent encapsulation
* in most cases we can live without requirejs, but in general for development purpose is pretty neat.

### How it can help
There is an option, to register result bundle as requirejs module. It presents one of the key features of `reason`, all inner modules won't be accessible outside the bundle scope, as well as whole lib could live as a global and requirejs module.

### Getting Started
Install the module: `npm install -g reason`

### Under the hood
* wrapped 'requirejs' (not sure if I will stick to that)
* and AST tools

###Usage
```
reason --root "demo1" --out "./dist.out" --src "main"
```
or
```
reason --config demo1/build.config
```
or
```
reason.convert(config, f excludeFunc(name){return 0 || 1}, f done(content){})
```

###Config
```javascript
// demo1/build.config
{
    "baseUrl": "."
    , "name": "main"
    , "out": "./build.js"
    , "optimize": "none"
    , "injectGlobals": ["this","d3", "$"]
    , "customGlobals": ["demo1"]
    , "initializeGlobals": ["demo1", "$", "d3"] 
    , "attachToGlobal": [{"lib":"one", "global":"demo1"}]
    , "removeDeps": []
    , "shim": {
      "jquery":{"exports":"$"}
    }
    , "exclude-libs": ["d3","jquery"]
    , "amd-module-name": "namespace/demo1"
  }
```

###Result 
```javascript

// output: 'demo1/build.js'
var demo1 = demo1 || {};
var $ = $ || {};
var d3 = d3 || {};

(function (parent, d3, $, demo1) {
    var jquery_plugins = function () {
            console.log('jquery-plugins');
        }();

    var depsfour = 'Yeah that\'s me, and I\'m in different folder';

    var one = demo1.one = function ($, d3, plugin, four) {
            return function () {
                d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
            };
        }($, d3, jquery_plugins, depsfour);

    var three = { hello: 'Yo!' };

    var two = function (three) {
            return three;
        }(three);

    var dotpathinner = function () {
            console.log('inner');
        }();

    var dotpathfi_ve = function (four, inner) {
            return four;
        }(depsfour, dotpathinner);

    (function (one, two, four, five) {
        console.log(one, two.hello, four, five);
    }(one, two, depsfour, dotpathfi_ve));
    if (typeof define === 'function' && define.amd) {
        define('namespace/demo1', main);
    }
}(this, d3, $, demo1));
```
## Limitation
* ability to attach only to one global object
* tested only with requirejs 'text!' plugin

## TODO
* make better api, at the moment there is a mess
* increase test coverage, at least a few tests
* documentation
