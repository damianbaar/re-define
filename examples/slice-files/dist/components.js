//externals: d3 
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
        , args

      if(f) {
        args = [m.exports, __req, m].concat(f.slice(1))
        f = f[0].apply(m, args)
        namespace[name] = f || m.exports;
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(typeof require == "function" && require) return require.apply(null, arguments);
        else if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) __req(name);

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
    var a = require('slice-files/common/a'), b = require('slice-files/common/b'), d3 = require('d3');
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
, window ? [window] : []
)
