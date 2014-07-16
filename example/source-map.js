var  _ = require('lodash')
  , fs = require('fs')
  , sourceMap = require('source-map')
  , SourceMapGenerator = sourceMap.SourceMapGenerator

// "start": {
//             "line": 1,
//             "column": 0
//         },
//         "end": {
//             "line": 15,
//             "column": 2
//         }
  //

//  "loc": {
//         "start": {
//             "line": 1,
//             "column": 0
//         },
//         "end": {
//             "line": 35,
//             "column": 0
//         }
  //
  //  "start": {
//     "line": 18,
//     "column": 4
// },
// "end": {
//     "line": 18,
//     "column": 19
// }

var map = new SourceMapGenerator({
  file: "bundle.js"
});

map.addMapping({
  generated: {
    line: 18,
    column: 4 
  },
  source: "lib/main.js",
  original: {
    line: 1,
    column:0 
  }
});

console.log(map.toString());
