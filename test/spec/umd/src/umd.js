var dep = require('./dep')
  , util = require('./util.object')
  , view1 = require('./view-1')
  , view2 = require('./view-2')

module.exports = { dep: dep
                 , name: 'umd'
                 , data: require('./data.json') 
                 , dots: util
                 , view1: view1
                 , view2: view2
                 }
