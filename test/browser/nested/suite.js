var assert = chai.assert
  , expect = chai.expect

describe('Nested', function(){
  describe('templates', function(){
    it('umd and default should expose a namespace', function(){
      assert.isNotNull(examples.nested)
      assert.isDefined(examples.nested)
    })
  }),
  describe('folders && modules', function() {
    it('flatten nested structure', function(){
      //the same name as folder
      assert.isDefined(examples.nested['common'])

      //normal structure taking from base and ignoring node_modules
      assert.isDefined(examples.nested['a/b'])
      assert.isDefined(examples.nested['a/c'])

      //nested dependency goes to first level as does not exists yet
      //but could be used by another dependency in tree
      assert.isDefined(examples.nested['d'])

      //project name - main module name
      assert.isDefined(examples.nested['test'])
    })
  })
})
