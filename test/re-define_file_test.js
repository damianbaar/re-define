var redefine = require('../lib')
  , _ = require('lodash')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , readFile    = _.compose(_.partialRight(fs.readFileSync, 'utf-8'), _.partial(path.resolve, __dirname))
  , outputs

exports['main'] = {
  setUp: function(done) {
    
    done();
  },
  'load-module': function(test) {
    var write = convert(function(result) {
      test.equal(result, getFiles(['./files.out/a.out']))
      test.done()
    })

    write.write({path: path.resolve(__dirname, './files/a.js')})
    write.end()
  },
  'load-modules': function(test) {
    var files = getFiles(
      [ './files.out/nested_n1.out'
      , './files.out/template.out'
      , './files.out/a.out'
      , './files.out/main.out'
      ])

    var write = convert(function(result) {
      test.equal(result, files)
      test.done()
    })

    write.write({path: path.resolve(__dirname, './files/a.js')})
    write.write({path: path.resolve(__dirname, './files/main.js')})
    write.write({path: path.resolve(__dirname, './files/template.html')})
    write.write({path: path.resolve(__dirname, './files/nested/n1.js')})
    write.end()
  }
};

function convert(done) { 
  var write = through.obj()
    , config = redefine.config()
    , result

  config.wrapper = 'empty'
  config.base = './test/files/'

  write
    .pipe(redefine.fromPath(config))
    .on('end', function() {
      done(escape(result))
    })
    .on('data', function(data) {
      result = data.toString()
    })

  return write
}

var cache = {}

function getFiles(files) {
  var r = _.reduce(files, function(memo, d) {
    var content

    if(!!cache[d]) content = cache[d]
    else content = readFile(d)

    return memo + content
  }, '')

  return escape(r)
}

function escape(val) {
  return val.replace(/\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
            .replace(/\_[0-9]*/g, '')
}

