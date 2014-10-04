require(
  [ "lodash"
  , "jquery"
  , "jquery/jquery2"
  , "d3"
  , "./model/model.js"
  , "./view/view.js"
  , "text!./template.html"
  , "d3/d3"
  ]
  , function(_, $, $2, d3, model, view, template) {

    var module = { jquery: $
                 , d3: d3
                 , model: model
                 , view: view
                 , template: template
                 , lodash: _ }

    return { draw: function() {
      document.querySelector('body').innerHTML = module.template
      document.querySelector('#module_name').innerHTML = 'modules: ' +  JSON.stringify(
        { d3: !!module.d3
        , jquery: !!module.jquery
        , model: !!module.model
        , view: !!module.view
        , lodash: module.lodash
        }, null, 2)
      }
    }
})
