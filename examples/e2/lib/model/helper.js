define(['require'], function(require){
  var async = require('async') || function() {}

  return { getAsync: async }
})
