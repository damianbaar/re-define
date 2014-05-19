define(
  [ "dotpath/fi-ve"
  , "text!./deps/template.html"
  , "two"
  , "exports"
  , "css!./styles.css"
  ]
  , function(five, template, exports){

    console.log(five, template, exports)

    return exports.one = function () {
      console.log(template)
    }
})
