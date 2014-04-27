require(
  [ "one"
  , "deps/four"
  , "text!./template.html"
  ]
  , function(one, four, t1)
  {
    return [one, four, t1]
})
