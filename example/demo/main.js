require(
  ["jquery"
  , "one"
  , "deps/four"
  , "text!./template.html"
  , "text!./deps/template.html"
  ]
  , function($, one, four, t1, t2)
  {
    console.log($, one, four, t1, t2)
})
