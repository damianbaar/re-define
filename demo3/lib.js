define(["vendor/text!./test.json"], function(data) {
  function test(){
    return "outside:"+data.toString()
  }

  return function(selection) {
          function test2() {
            return "inside"
          }
          return test() + test2()
         }
})
