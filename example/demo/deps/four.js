define(
  ["d3/d3","jquery", "text/text!../template.html", "text/text!./template.html"]
, function(d3,$,template1, template2) {
  return "Yeah that's me, and I'm in different folder" + template1 + template2
})
