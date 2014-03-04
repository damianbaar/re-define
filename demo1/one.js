define(["jquery","d3", "jquery-plugins","deps/four"]
,function($, d3, plugin, four){
  return function () {
     d3
       .select("body")
       .append("div")
       .text("Hi there! I'm talking to four, four?"+ four)
  }
})
