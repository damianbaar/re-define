
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, __req, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(!!require) return require.apply(null, arguments);
        else if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) __req(name);
  return __req;
})
({ 
'common/c': [function(exports, require, module, __filename, __dirname) { 
    module.exports = { c: true };
}, {"__filename":"c.js","__dirname":"common"}], 
'common/a': [function(exports, require, module, __filename, __dirname) { 
    var c = require('common/c');
    return {
      a: true,
      c: c
    };
}, {"__filename":"a.js","__dirname":"common"}], 
'common/b': [function(exports, require, module, __filename, __dirname) { 
    var c = require('common/c');
    return {
      b: true,
      c: c
    };
}, {"__filename":"b.js","__dirname":"common"}], 
'entry-1': [function(exports, require, module, __filename, __dirname) { 
    var a = require('common/a'), b = require('common/b'), d3 = require('d3');
    console.log('dirname: ', __dirname, 'filename: ', __filename);
    module.exports = function () {
      return {
        'entry-1': [
          a,
          b
        ]
      };
    };
}, {"__filename":"entry-1.js","__dirname":"."}], 
'entry-2': [function(exports, require, module, __filename, __dirname) { 
    var a = require('common/a');
    module.exports = function () {
      return { 'entry-2': [a] };
    };
}, {"__filename":"entry-2.js","__dirname":"."}]
}
,  function() { this.my = this.my || {};this.my.awesome = this.my.awesome || {};this.my.awesome.example = this.my.awesome.example || {}; return this.my.awesome.example }.call(this) 
, [window]
)
