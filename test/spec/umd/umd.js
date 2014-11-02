var dep = require('./dep')
  , util = require('./util.object')

module.exports = { dep: dep
                 , name: 'umd'
                 , data: require('./data.json') 
                 , dots: util
                 }
