var transform = require('../../lib/transform/get-ast')
  , redefine = require('../../lib')
  , _ = require('lodash')
  , Module = require('re-define-module')
  , acorn = require('acorn')
  , through = require('through2')
  , escodegen = require('escodegen')
  , path = require('path')

exports['get-ast'] = {
  'shout when syntax error': function(test) {

    test.expect(1)

    var m = createModule('main')
    m.contents = acorn.parse(';var a = 10')

    try {
      convert(m)
    } catch(e) {
      test.ok(true)
      test.done()
    }
  }
}

function createModule(name, empty) {
  var m = Module({path: name + ".js", name: name});
  !empty && (m.contents = new Buffer(""))
  return m
}

function convert(file, done, write) {
  var writer = through.obj(function(chunk, enc, next) {
    write && write(chunk)
    next()
  })

  var stream = transform(redefine.config(), writer)
                .on('data', function(f) {
                  done(f)
                })

  stream.write(file)
}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
}
