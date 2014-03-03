# ByeByeAMD
Proof of concept rather than fully functional lib.

### How it works:
All AMD modules (soon CommonJS) are resolved into one, clean javascript file.

## Getting Started
Install the module: `npm install -g bbamd`

###Config
```javascript
  var config = {
    , optimize: 'none'
    , injectGlobals: [] //i.e. "this","window","document"
    , customGlobals: [] //i.e. "scope1","scope2"
    , initializeGlobals: [] //i.e. "scope1","scope2"
    , attachToGlobal: [] //i.e. list of {lib:"three", global:"scope1"}
    , "amd-module-name": "ns/lib" //register as amd module
    , "exclude-libs" : ["text"] 
    , "exclude-folder": "vendor" 
  }
```

###Usage
```
bbamd --root "demo1" --out "./dist.out" --src "main"
```
or
```
bbamd --config demo1/build.config
```
or
```
bbamd.convert(config, f excludeFunc(name){return 0 || 1}, f done(content){})
```

###Result
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
_(Coming soon)_

