define(
  ["dotpath/fi-ve", "text!./deps/template.html", "exports"]
  , function(five, template, exports){

    return exports.one = function () {
       d3
         .select("body")
         .append("div")
         .text("Hi there! I'm talking to four, four?"+ five)
    }
})
