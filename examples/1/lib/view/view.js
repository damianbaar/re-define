var tmpl = require('./template.html')
  , model = require('../model/model')
  , helper = require('./helper')
  , type = require('./type')
  , d3 = require('d3')

module.exports = function() {
  return { model: model.getData()
         , view: tmpl
         , helper: helper }
}
