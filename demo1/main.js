require(
  ["one","two","deps/four", "dotpath/fi-ve"]
  , function(one, two, four, five)
  {
    console.log(one, two.hello, four, five)
})
