var model = require('model/model')
  , view = require('view/view')
  , $ = 3//require('jquery/jquery')

module.exports = { model: model
                 , view: view 
                 , jquery: $ }


function abc() {
  console.log('yeah')
}

abc()
