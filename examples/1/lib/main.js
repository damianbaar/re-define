require(
  [ "lodash"
  , "jquery"
  , "d3"
  , "./model/model"
  , "./view/view"
  , "text!./template.html"
  ]
  , function(_, $, d3, model, view, template) {

    function getTemplate() {
      return template
    }

    return { jquery: $
           , d3: d3
           , model: model
           , view: view
           , template: template
           , lodash: _ }
})
