var lightning = require('../lib/lightning');

// Dummy filters
lightning.filters.foo1 = function(str){
  return str + ' loo';
}

lightning.filters.foo2 = function(str){
  return str + ' woo';
}

// Actual tests
describe('filter', function() {

  it('should work as expected', function() {
    lightning.filter('foo', []).should.be.equal('foo');
    lightning.filter('foo', ['foo1', 'foo2']).should.be.equal('foo loo woo');
  });
  
});