require(
  [ "./one"
  , "jquery"
  , "./deps/four"
  , "text!./template.html"
  , "domReady!"
  ]
  , function(one, jquery, four, t1)
  {
    console.log(jquery)
    return [one, four, t1]
})
