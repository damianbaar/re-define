var tmpl = require('./template.html')
  , model = require('../model/model')
  , helper = require('./helper')
  , type = require('./type')

module.exports = function() {
  return { model: model.getData()
         , view: tmpl
         , helper: helper }
}
