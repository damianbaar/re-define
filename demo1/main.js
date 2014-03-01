require(["one","two","deps/four"], function(one, two, four){
  console.log(one, two.hello, four)
})
