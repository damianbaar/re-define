// var view = require('text!view/view.html')
var view = require('text!view/view.html')
  , tmpl = require('text!./template/template.html')

module.exports = { name: 'model'
                 , view: view 
                 , template: tmpl
                 }

function abcde() {
  console.log('yeah')
}

abcde()
