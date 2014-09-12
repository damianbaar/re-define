define(['require'], function(require){
  var async = require('async/async') || function() {}

  return { getAsync: async }
})
