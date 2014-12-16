if (typeof define === 'function' && define.amd) define('nanana')

process.env.TEST = 'test'

module.exports = { process: process
                 , filename: __filename
                 , dirname: __dirname }



