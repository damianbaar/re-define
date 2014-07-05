define(["./helper"],function(helper){
  var async = helper.getAsync()

  return { getData: function() { return async ? 'async_data' : 'data' } }
})
