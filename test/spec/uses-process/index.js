var test = { dep: dep
           , name: 'iife' }

process.env.TEST = 'test'

if (typeof define === 'function' && define.amd) define('nanana')

