var model = require('../model/model')
  , tmpl = require('text!./template.html')
  , helper = require('./helper')
  , type = require('./type')

module.exports = function() {
  return { model: model.getData()
         , view: tmpl
         , helper: helper }
}
