//re-define version:1.14.4
//externals: d3
require = (function() {
return (function (modules, namespace, imports) {
  var __oldReq = typeof require == "function" && require

  function __req(name){

    if(!namespace[name]) {
      var f = modules[name]
        , m = { exports:{} }
        , args

      if(f) {

        args = [m.exports, function(x) {
          return __req(x)
        }, m].concat(f.slice(1))

        namespace[name] = m;
        f = f[0].apply(null, args);
        f && (m.exports = f);
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(__oldReq) return __oldReq.apply(null, arguments);
        throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name].exports;
  }

  return __req;
})
({ 
'slice-files/common/c': [function(exports,require,module,define) { 
    module.exports = { c: true };
},null], 
'slice-files/common/a': [function(exports,require,module,define) { 
    var c = require('slice-files/common/c');
    return {
      a: true,
      c: c
    };
},null], 
'slice-files/common/b': [function(exports,require,module,define) { 
    var c = require('slice-files/common/c');
    return {
      b: true,
      c: c
    };
},null], 
'slice-files/entry-1': [function(exports,require,module,__filename,__dirname) { 
    var a = require('slice-files/common/a');
    var b = require('slice-files/common/b');
    var d3 = require('d3');
    console.log('dirname: ', __dirname, 'filename: ', __filename);
    module.exports = function () {
      return {
        'entry-1': [
          a,
          b
        ]
      };
    };
},"entry-1.js","."], 
'slice-files/entry-2': [function(exports,require,module) { 
    var a = require('slice-files/common/a');
    module.exports = function () {
      return { 'entry-2': [a] };
    };
}]
}
,  function() { this.my = this.my || {};this.my.awesome = this.my.awesome || {};this.my.awesome.example = this.my.awesome.example || {}; return this.my.awesome.example }.call(this) 
, typeof window === 'undefined' ? [] : [window]
)
})()
