require(
  [ "one"
  , "jquery"
  , "deps/four"
  , "text!./template.html"
  , "domReady!"
  ]
  , function(one, jquery, four, t1)
  {
    return [one, four, t1]
})
