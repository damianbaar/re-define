require(
  [ "jquery"
  , "d3"
  , "./model/model"
  , "./view/view"
  , "text!./template.html"
  , "_d3"
  , "__d3"
  ]
  , function($, d3, model, view, template)
  {
    return { jquery: $
           , d3: d3
           , model: model
           , view: view
           , template: template }
})
