define(
  [ "./dotpath/fi-ve"
  , "text!./deps/template.html"
  , "./two"
  , "dep/dep"
  , "css!./styles.css"
  ]
  , function(five, template, two, dep){

    console.log(five, template)

    return function () {
      console.log(template)
    }
})
