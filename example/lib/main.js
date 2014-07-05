require(
  [ "jquery"
  , "d3"
  , "./model/model"
  , "./view/view"
  , "text!./template.html"
  ]
  , function($, d3, model, view, template)
  {
    return [$, d3, model, view, template]
})
