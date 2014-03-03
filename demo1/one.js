define(["deps/four"],function(four){
  return function () {
     d3
       .select("body")
       .append("div")
       .text("Hi there! I'm talking to four, four?"+ four)
  }
})
