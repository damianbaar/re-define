var redefine = require('../lib')
  , _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , readFile    = _.compose(_.partial(fs.readFileSync, _, 'utf-8'), _.partial(path.resolve, __dirname))
  , readStream  = _.compose(fs.createReadStream, _.partial(path.resolve, __dirname))

function convert(file, done, follow) { 
  var write = through()
    , config = redefine.config()
    , convert = redefine.fromPath(config)
    , result

  config.wrapper = 'empty'
  config.base = './test/test1.in/'
  config.fileMode = true

  convert.write({path: path.resolve(__dirname, './test1.in/a.js')})
  convert.write({path: path.resolve(__dirname, './test1.in/main.js')})
  convert.write({path: path.resolve(__dirname, './test1.in/template.html')})
  convert.write({path: path.resolve(__dirname, './test1.in/nested/n1.js')})
  convert.end()

   convert 
    .pipe(through(function(chunk, enc, cb) { 
      this.push(chunk)
      cb()
    }))
    .on('end', function() {
      done(escape(result))
    })
    .on('data', function(data) {
      result = data.toString()
    })

}

function escape(val) {
  return val.replace(/\n|\r/g,'')
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
