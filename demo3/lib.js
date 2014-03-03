define(["vendor/text!./test.json"], function() {
  function test(){
    console.log("test")
  }

  return function(selection) {
          function test2() {
            return "test"
          }
          return test()
         }
})
