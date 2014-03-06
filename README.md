# Redefine
This is not a clone of AMDClean. Way of resolving RequireJS modules is pretty much the same, however there are some differences ... will post latter about that.

### How it works:
All AMD modules (soon CommonJS) are resolved into one, clean javascript file.
## Reason:
* get decent encapsulation
* in some cases we can live without requirejs, but in general for development purpose is preatty neat.

## How it can help
There is an option, to register result bundle as requirejs module. It presents one key feature of `redefine`, which is, all inner modules won't be accessible outside the bundle scope, as well as whole lib could live as a global and requirejs module.

## Getting Started
Install the module: `npm install -g redefine`

## Under the hood
* wrapped 'requirejs' (not sure if I will stick to that)
* and AST tools

###Config
```javascript
  var config = {
    , optimize: 'none'
    , injectGlobals: ["d3"] //i.e. "this","window","document"
    , customGlobals: ["custom_global"] //i.e. "scope1","scope2"
    , initializeGlobals: ["custom_global"] //i.e. var custom_global = custom_global || {} 
    , attachToGlobal: [] //i.e. list of {lib:"three", global:"custom_global"}
    , "amd-module-name": "ns/lib" //register as amd module define(ns/lib, fun(){})
    , "exclude-libs" : ["text","d3"]  //we don`t want to have a d3 and text in our bundle
    , "exclude-folder": "vendor" 
    , "removeDeps":["jquery"] //expect that those libs are defined globally
	  , shim: {
			"d3/d3": { exports: "d3" }
	  }
    , paths: {
      "d3/d3": "bower_components/d3/d3-v3"
    }
  }
```

###Usage
```
redefine --root "demo1" --out "./dist.out" --src "main"
```
or
```
redefine --config demo1/build.config
```
or
```
redefine.convert(config, f excludeFunc(name){return 0 || 1}, f done(content){})
```

###Result (check demo1 folder, to get the source)
```javascript
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

## Documentation

## TODO
* make better api, at the moment there is a mess
* increase test coverage, at least a few tests
* documentation
