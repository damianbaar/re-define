require(
  [ //"./one"
   "jquery"
  , "text!./deps/template.html"
  // "d3"
  // , "notFound"
  // , 'require'
  ]
  , function($, tmpl)
  {
    var b = require('async')

    console.log(jquery, umd)

    return [$, tmpl]
})
