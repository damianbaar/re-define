define(
  [ "./dotpath/fi-ve"
  , "text!./deps/template.html"
  , "./two"
  , "dep/dep"
  , "exports"
  , "css!./styles.css"
  ]
  , function(five, template, two, dep, exports){

    console.log(five, template, exports)

    return exports.one = function () {
      console.log(template)
    }
})
