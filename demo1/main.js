require(["one","two","deps/four"], function(one, two, four){
  one()
  console.log(two.hello, four)
})
