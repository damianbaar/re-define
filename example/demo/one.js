define(
  ["jquery"
  ,"d3/d3"
  , "deps/four"
  , "./dotpath/fi-ve"
  , "three"
  , "text/text!./template.html"
  , "text/text!./deps/template.html"]
,function($, d3, four, three, template1, template2){
  return function () {
     d3
       .select("body")
       .append("div")
       .text("Hi there! I'm talking to four, four?"+ four)
  }
})
