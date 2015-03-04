
///re-define "index.js,entry1.js,entry2.js" --namespace spec.multi --project-name test


exports = [require('test/entry1'), require('test/entry2'), require('test')]
