define(
  [ "./dotpath/fi-ve"
  , "text!./deps/template.html"
  // , "./two"
  // , "dep/dep"
  , "require"
  // , "css!./styles.css"
  ]
  , function(five, template, require){

    console.log(five, template)
    var a = require('dep/dep')
      , b = require('text!./deps/'+'template.html')
      , ext = require('d3/d3')

    return function () {
      console.log(template)
    }
})
