module.exports = function() {
  var i = 0
  return { next: function() { return i++ }}
}
