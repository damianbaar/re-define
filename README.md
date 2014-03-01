# ByeByeAMD

## Getting Started
Install the module with: `npm install bbamd`

###Config
```javascript
  //Hardcoded atm
  var config = {
    , optimize: 'none'
    , onBuildWrite: parse
    , injectGlobals: ["this","window","document"]
    , customGlobals: ["scope1","scope2"]
    , initializeGlobals: ["scope1","scope2"] 
    , attachToGlobal: [{lib:"three", global:"scope1"}
                      ,{lib:"one", global:"scope2"}]
  }
```

###Usage
```
node main.js --root "demo1" --out "./dist.out" --src "main"

bbamd --root "demo1" --out "./dist.out" --src "main"
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
to find out more, check demo folder

