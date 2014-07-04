module.exports = {
    match     : match
  , attach    : attach
}

function match(getProgram) { return getProgram().body.length > 0 }
function attach(getProgram) { return { ast : getProgram()} }
