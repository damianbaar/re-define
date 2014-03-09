define(["jquery","d3/d3", "deps/four", "text!./template.html", "text!./deps/template.html"]
,function($, d3, four, template1, template2){
  return function () {
     d3
       .select("body")
       .append("div")
       .text("Hi there! I'm talking to four, four?"+ four)
  }
})
