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
(function (parent, demo1) {
    var depsFour = 'I\'m in different folder';
    var one = function (four) {
            return 'Hi there!' + ' and I\'m talking to four:' + four;
        }(depsFour);
    var three = demo1.three = { hello: 'Yo!' };
    var two = function (three) {
            return three;
        }(three);
    (function (one, two, four) {
        console.log(one, two.hello, four);
    }(one, two, depsFour));
}(this, demo1));
```

## Documentation

## TODO
* make better api, at the moment there is a mess
* increase code coverage
* documentation
