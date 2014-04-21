define(["dotpath/fi-ve"], function(five){
  return function () {
     d3
       .select("body")
       .append("div")
       .text("Hi there! I'm talking to four, four?"+ five)
  }
})
