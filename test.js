var fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , combine = require('stream-combiner')
  , _ = require('underscore')

var complex = through.obj(function(chunk, enc, cb) {
  reader.write(chunk.replace(/\|/g, '*'))
  cb()
})

var reader = through.obj(function(chunk, enc, cb) {
  this.push(chunk.replace(/\*/g, '_'))
  cb()
})

fs.createReadStream('package.json')
  .pipe(through.obj(function(chunk, enc, cb) {
    var me = this
    _.each(JSON.parse(chunk.toString()), function(d, i) { me.push(d) })
    cb()
  }))
  .pipe(through.obj(function(chunk, enc, cb) {
    if(_.isString(chunk))
      this.push(chunk.toUpperCase())
    cb()
  }))
  .pipe(through.obj(function(chunk, enc, cb) {
    this.push(chunk.split('').join('|'))
    cb()
  }))
  .pipe(combine(complex, reader))
  .pipe(process.stdout)
