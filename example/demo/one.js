define(
  [ "dotpath/fi-ve"
  , "text!./deps/template.html"
  , "exports"
  , "css!./styles.css"
  ]
  , function(five, template, exports){

    console.log(five, two, template, exports)

    return exports.one = function () {
      console.log(template())
    }
})
