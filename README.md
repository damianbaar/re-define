# ByeByeAMD

## Getting Started
Install the module with: `npm install bbamd`

###Config
```javascript
  var config = {
    , optimize: 'none'
    , injectGlobals: [] //i.e. "this","window","document"
    , customGlobals: [] //i.e. "scope1","scope2"
    , initializeGlobals: [] //i.e. "scope1","scope2"
    , attachToGlobal: [] //i.e. list of {lib:"three", global:"scope1"}
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

###Result
```javascript
//demo1
var scope1 = {};
var scope2 = {};
(function (parent, window, document, scope1, scope2) {
    var depsFour = 'I\'m in different folder';
    var one = scope2.one = function (four) {
            return 'Hi there!' + ' and I\'m talking to four:' + four;
        }(depsFour);
    var three = scope1.three = { hello: 'Yo!' };
    var two = function (three) {
            return three;
        }(three);
    (function (one, two, four) {
        console.log(one, two.hello, four);
    }(one, two, depsFour));
}(this, window, document, scope1, scope2));
```

## Documentation
_(Coming soon)_

## Examples
Check demo folder

