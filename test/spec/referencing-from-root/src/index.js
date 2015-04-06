var model = require('model/model')
  , view = require('view/view')
  , $ = require('jquery/jquery')

module.exports = { model: model
                 , view: view 
                 , jquery: $ }


function abc() {
  console.log('yeah')
}

$.test()
abc()
