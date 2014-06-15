var _ = require('lodash')
  , acorn = require('acorn')
  , converter = require('../../lib/converter/type/amd-define')

var def_mod_1 = {
    in: 'define("a", [], function() { return "Hello" })'
  , out: '"Hello"'
  }
  , def_mod_2 = {
    in: 'define(function() { var c = wrap() })'
  , out: 'function () {var c = wrap();}()'
  }
  , def_mod_3 = {
    in: 'define({ c: "test" })'
  , out: '{c: "test"}'
  }
  , def_mod_4 = {
    in: 'define("c", ["a","b"], function(a, b) { return "Hello" })'
  , out: 'function (a, b) {return "Hello";}(a, b)'
  }

exports['converter.amd-define'] = {
  'named-module-with-return': function(test) {
    var code = function() { return acorn.parse(def_mod_1.in).body }
      , c = converter.attach({}, code)

    test.ok(converter.match(code))
    test.equal(escape(c.transform()), escape(def_mod_1.out))
    test.equal(c.name, 'a')
    test.done()
  },
  'module-name-based-on-file-with-return': function(test) {
    var code = function() { return acorn.parse(def_mod_2.in).body }
      , module = {name: 'test_module'}
      , c = _.merge(module, converter.attach(module, code))

    test.ok(converter.match(code))
    test.equal(escape(c.transform()), escape(def_mod_2.out))
    test.equal(module.name, 'test_module')
    test.done()
  },
  'simple-object': function(test) {
    var code = function() { return acorn.parse(def_mod_3.in).body }

    test.ok(converter.match(code))
    test.equal(escape(transform(converter, code)), escape(def_mod_3.out))
    test.done()
  },
  'named-module-with-externals': function(test) {
    var code = function() { return acorn.parse(def_mod_4.in).body }
      , module = {}
      , c = _.extend(module, converter.attach(module, code))

    test.ok(converter.match(code))
    test.equal(escape(c.transform()), escape(def_mod_4.out))
    test.done()
  },
  'transform-deps-after-resolve': function(test) {
    var expected = 'function (a, b) { return "Hello"; }(c_a, c_b)'
      , input = 'define("c", ["a","b"], function(a, b) { return "Hello" })'

    var code = function() { return acorn.parse(input).body }
      , module = {}
      , c = _.extend(module, converter.attach(module, code))
    
    //change them somehow, align path, get rid of domReady! and so on
    module.deps = _.map(module.deps, function(d) { return 'c_'+d })

    test.ok(converter.match(code))
    test.equal(escape(c.transform()), escape(expected))
    test.done()
  }
}

function transform(converter, code, module) {
  return converter.attach(module || {}, code).transform()
}

function escape(val) {
  return val.replace(/\r?\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
            .replace(/\_[0-9]*/g, '')
}

