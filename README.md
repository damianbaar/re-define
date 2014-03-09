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
// example/demo1/build.config
{
  "baseUrl": "example/demo1/"
  , "name": "main"
  , "out": "./build.js"
  , "export":  
      { "outside/comp1": 
          { "amd": "namespace/demo1/comp1"
          , "global": 
            { "name": "common"
            , "init": true}
          }
      , "deps/four": 
          { "amd": "namespace/demo1/comp1"
          , "global": "demo1"
          }
      }
  , "resolve": 
      { "this":
        { "as": "parent"
        , "inject": true
        }
      , "d3/d3": 
        { "external": true
        , "inject": true
        , "as" : "d3"
        , "global":"common"
        }
      , "jquery": 
        { "external": true
        , "inject": true
        , "as": "$"
        }
      , "namespace/comp1":
        { "external": true
        , "as": "ddeemmoo"
        , "global": "common"
        }
      , "outside/comp1":
        { "as": "matcher"
        , "path": "../vendor/comp"
        , "external": false
        }
      }
}
```

###Result 
```javascript

// output: 'demo1/build.js'
var common = common || {};
var demo1 = demo1 || {};
(function (parent, d3, $, ddeemmoo, common, demo1) {
  var scope = {};
  var matcher = common['outside/comp1'] = 'I\'m from outside the project.';
  scope['template.html'] = '<div>test</div>\n<div></div>\n<div></div>\n<div></div>\n';
  scope['deps/template.html'] = '<li></li>\n<li></li>\n<li></li>\n<li></li>\n';
  scope['deps/four'] = demo1['deps/four'] = function (d3, $, template1, template2) {
    return 'Yeah that\'s me, and I\'m in different folder' + template1 + template2;
  }(d3, $, scope['template.html'], scope['deps/template.html']);
  scope['dotpath/inner'] = function () {
    console.log('inner');
  }();
  scope['dotpath/fi-ve'] = function (four, inner) {
    return four;
  }(scope['deps/four'], scope['dotpath/inner']);
  var one = function ($, d3, four, template1, template2) {
      return function () {
        d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
      };
    }($, d3, scope['deps/four'], scope['dotpath/fi-ve'], scope['template.html'], scope['deps/template.html']);
  (function (d3, $, comp1, comp2, one) {
    console.log(d3, $, comp1, comp2, one);
  }(d3, $, ddeemmoo, matcher, one));
  if (typeof define === 'function' && define.amd)
    define('namespace/demo1/comp1', matcher);
  if (typeof define === 'function' && define.amd)
    define('namespace/demo1/comp1', scope['deps/four']);
}(this, common['d3/d3'], $, common['namespace/comp1'], common, demo1));
```

## TODO
* increase test coverage, at least a few tests
* documentation
