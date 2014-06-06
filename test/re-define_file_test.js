var redefine = require('../lib')
  , _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , readFile    = _.compose(_.partial(fs.readFileSync, _, 'utf-8'), _.partial(path.resolve, __dirname))
  , readStream  = _.compose(fs.createReadStream, _.partial(path.resolve, __dirname))

function convert(file, done, follow) { 
  var write = readStream(file)
    , config = redefine.config()
    , result

  config.wrapper = 'empty'
  config.base = 'test/test1.in'
  config.follow = follow

  write
    .pipe(redefine.convert(config))
    .pipe(through(function(chunk, enc, cb) { 
      this.push(chunk)
    }))
    .on('data', function(data) {
      done(escape(data.toString()))
    })
}

function escape(val) {
  return val.replace(/\r?\n|\r/g,'')
            .replace(/\'|\"/g, '"')
            .replace(/\ |\;/g, '')
            .replace(/\_[0-9]*/g, '')
}

exports['main'] = {
  setUp: function(done) {
    done();
  },
  // 'module-load-no-follow': function(test) {
  //   convert('./files/main.js', function(result) {
  //     test.equal(result, escape(readFile('./files/load.no.follow.out.js')))
  //     test.done()
  //   }, false)
  // },
  // 'module-load-no-follow-plugins': function(test) {
  //   test.done()
  // },
  'module-load-follow': function(test) {
    convert('./test1.in/main.js', function(result) {
      test.equal(result, escape(readFile('./test1.out/load.follow.out.js')))
      test.done()
    }, true)
  }
};
