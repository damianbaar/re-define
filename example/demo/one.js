define(
  ["jquery"
  ,"d3/d3"
  , "dotpath/fi-ve"
  ]
,function($, d3, five){
  return function () {
     d3
       .select("body")
       .append("div")
       .text("Hi there! I'm talking to four, four?"+ five)
  }
})
