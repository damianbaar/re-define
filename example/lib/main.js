require(
  [ //"./one"
   "jquery"
  , "d3"
  // , "two"
  // , "./deps/four"
  // , "./umd"
  // , "text!./template.html"
  // , 'require'
  // , "domReady!"
  ]
  , function(one, jquery, four, umd, t1, require)
  {
    var t = require('jquery')
      , b = require('async')

    console.log(jquery, umd)
    return [one, four, t1, umd]
})
