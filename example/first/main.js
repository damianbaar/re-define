require(
  [ "./one"
  , "jquery"
  , "./deps/four"
  , "./umd"
  , "text!./template.html"
  , "domReady!"
  ]
  , function(one, jquery, four, umd, t1)
  {
    console.log(jquery, umd)
    return [one, four, t1, umd]
})
