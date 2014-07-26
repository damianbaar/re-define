var util = require('util')
  , _ = require('lodash')
  , File = require('vinyl')
  , path = require('path')
  , isBuffer = require('vinyl/lib/isBuffer')
  , isStream = require('vinyl/lib/isStream')
  , isNull = require('vinyl/lib/isNull')

module.exports = Module

util.inherits(Module, File)

function Module(options) {
  this.paths = []

  options = _.merge.apply(null, arguments)

  for(var i in options) this[i] = options[i]

  if (!(this instanceof Module)) return new Module(options)

  File.call(this, options)
}

Object.defineProperty(Module.prototype, 'name', {
  get: function() { return this._name || this.relative },
  set: function(val) { this._name = val }
})

Object.defineProperty(Module.prototype, 'path', {
  get: function() { return this.paths[ this.paths.length - 1] },
  set: function(val) { 
    if(this.paths.indexOf(val) === -1) {
      this.ext = path.extname(val)
      this.paths.push(val) 
    }
  }
})

Object.defineProperty(Module.prototype, 'contents', {
  get: function() { return this._contents },
  set: function(val) { 
    if (!isBuffer(val) && !isStream(val) && !isNull(val) && !isAST(val))
      throw new Error("File.contents can only be a Buffer, a Stream, AST, or null.");

    this._contents = val 
  }
})

Object.defineProperty(Module.prototype, 'parent', {
  get: function() { return this._parent || this.name },
  set: function(val) { this._parent = val }
})

Object.defineProperty(Module.prototype, 'reference', {
  get: function() { return this._reference || this.name },
  set: function(val) { this._reference = val }
})

Module.prototype.isAST = function() { return isAST(this.contents) }

function isAST(val) { return _.has(val, 'type') && val.type === 'Program' }
