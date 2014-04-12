'use strict';

var reason = require('reason')

var req_mod_1 = {
    in: "require([], function() { console.log('req') })"
  , out: "(function () {\n  console.log('req');\n}());"
  }
  , req_mod_2 = {
    in: 'require(["a","b","c"], function(a,b,c) { console.log(a, b, c) })'
  , out: '(function (a, b, c) {\n  console.log(a, b, c);\n}(a, b, c));'
  }
  , def_mod_1 = {
    in: 'define("a", [], function() { return "Hello" })'
  , out: "var a = \'Hello\';"
  }
  , def_mod_2 = {
    in: 'define("b", ["a"], function(a) { var c = wrap(a) })'
  , out: 'var b = function (a) {\n    var c = wrap(a);\n  }(a);'
  }
  , def_mod_3 = {
    in: 'define("c", ["a","b"], function(a, b) { return "Hello" })'
  , out: 'var c = function (a, b) {\n    return \'Hello\';\n  }(a, b);'
  }

exports['main'] = {
  setUp: function(done) {
    done();
  },
  'convert-define-to-var': function(test) {
    test.equal(def_mod_1.out, reason().convert(def_mod_1.in))

    test.done()
  },
  ' convert-multiple-define-to-var': function(test) {
    test.equal([def_mod_1.out, def_mod_2.out].join("\n"),
               reason().convert([def_mod_1.in, def_mod_2.in].join(";")))

    test.done()
  },
  'check-order-for-modules': function(test) {
    test.equal([def_mod_1.out, def_mod_2.out, def_mod_3.out].join("\n"),
               reason().convert([def_mod_1.in, def_mod_2.in, def_mod_3.in].join(";")))

    test.equal([def_mod_1.out, def_mod_2.out, def_mod_3.out].join("\n"),
               reason().convert([def_mod_3.in, def_mod_2.in, def_mod_1.in].join(";")))

    test.done();
  },
  'convert-single-require': function(test) {
    test.equal(req_mod_1.out, reason().convert(req_mod_1.in))

    test.done();
  },
  'convert-require': function(test) {
    test.equal(
      [def_mod_1.out, def_mod_2.out, def_mod_3.out, req_mod_2.out].join("\n"),
      reason().convert([def_mod_1.in, req_mod_2.in, def_mod_2.in, def_mod_3.in].join(";")))

    test.done();
  }
};
