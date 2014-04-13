function newLine(begin) {
  var l =  "______________________"
  return "\n"+ l + l+ (begin ? "\n" : "\n\n")
}

module.exports.newLine = newLine