define(
  ["dotpath/fi-ve", "text!./deps/template.html", "exports"]
  , function(five, template, exports){

    console.log(five, template, exports)

    return exports.one = function () {
      console.log(template())
    }
})
