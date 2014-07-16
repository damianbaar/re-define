var model = require('../model/model')
  , tmpl = require('text!./template.html')

module.exports = function() {
  return { model: model.getData()
         , view: tmpl }
}

exports.test = {}
exports.test2 = {}
