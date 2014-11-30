#### Example

How to use import/export namespaces when one part let's say components need custom version and needs to be deployable separately.

#### Build
```
re-define --cwd components '**/index.js' --namespace ns.org.components > components.js
re-define --cwd app app/index.js --imports ns.org.components --namespace ns.org.app --globals '{"jquery":"$"}' --wrapper 'global' --exclude 'components/**' > app.js
```
#### Explanation

* index
```html
  <script src="components.js" type="text/javascript" charset="utf-8"></script>
  <script src="app.js" type="text/javascript" charset="utf-8"></script>
```

* re-usable part

`re-define --cwd components '**/index.js' --namespace ns.org.components > components.js`

Get all `index.js` files from folders and expose them within `ns.org.components` namespace, once finished save everything to `components.js`

* app
```
re-define --cwd app app/index.js --imports ns.org.components --namespace ns.org.app --globals '{"jquery":"$"}' --wrapper 'global' --exclude 'components/**' > app.js
```

Start from `app/index.js`, import `ns.org.components` and register module `api` within `ns.org.app`, when requesting `require(jquery)` get it from global scope as `$` and wrap it by `global` template to expose only returned module. Exclude those dependencies which we assume belong to namespace, this is `components/**` and save it to `app.js`

```js
//components

(function (modules, namespace, imports) {
  //re-define _require internals, for details check lib/templates/part/require.tmpl
})
({ 
'components/profile': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'profile';
}, {"__filename":"","__dirname":""}], 
'dropdown': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dropdown';
}, {"__filename":"","__dirname":""}], 
'components/lookup/ui/ui': [function(exports, require, module, __filename, __dirname) { 
    var dd = require('dropdown');
}, {"__filename":"","__dirname":""}], 
'components/lookup/util': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'utils';
}, {"__filename":"","__dirname":""}], 
'components/lookup': [function(exports, require, module, __filename, __dirname) { 
    var dropdown = require('components/lookup/ui/ui'), util = require('components/lookup/util');
    module.exports = 'lookup';
}, {"__filename":"","__dirname":""}], 
'components': [function(exports, require, module, __filename, __dirname) { 
    var a = require('components/profile'), b = require('components/lookup');
}, {"__filename":"","__dirname":""}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.components = this.ns.org.components || {}; return this.ns.org.components }.call(this) 
, []
)
```

```js
//app
(function (parent, factory){
  if (typeof exports === 'object') {
    // Referenced exactly the same as with node
    module.exports = factory(require('jquery'))
  } else {
    var jquery =  parent.$

    parent["ns"] = parent["ns"] || {};
    parent["ns"]["org"] = parent["ns"]["org"] || {};
    parent["ns"]["org"]["app"] = factory(jquery);

  }
  }(this, function (jquery) {

  var closure = {}

  closure['jquery'] = jquery

  //externals: components/profile,components/lookup,jquery 

  //re-define _require internals, for details check lib/templates/part/require.tmpl
})
({ 
'app': [function(exports, require, module, __filename, __dirname) { 
    var profile = require('components/profile'), lookup = require('components/lookup'), $ = require('jquery');
    module.exports = {
      start: function () {
        console.log(profile);
        console.log(lookup);
        console.log($);
        console.log('start');
      }
    };
}, {"__filename":"","__dirname":""}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.app = this.ns.org.app || {}; return this.ns.org.app }.call(this) 
, [closure,ns.org.components]
)

return __req('app')

}.bind({})))
```
