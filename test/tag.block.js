var lightning = require('../lib/lightning');

describe('tag#block', function() {

  it('should not do anything in the general case', function(done) {
    lightning.tmpl('<b>{{block foo}}bar{{/block}}</b>', null, null, function(err, res){
      res.toString().should.eql('<b>bar</b>');
      done();
    })
  });
  
  it('should return block contents in any case', function(done) {
    lightning.tmpl('<b>{{block foo}}bar{{/block}}</b>', null, null, function(err, res){
      res.blocks.foo.should.eql('bar');
      done();
    })
  });
  
  it('should work with empty block contents', function(done) {
    lightning.tmpl('<b>{{block foo}}{{/block}}</b>', null, null, function(err, res){
      res.toString().should.eql('<b></b>');
      res.blocks.foo.should.eql('');
      done();
    })
  });
  
  it('should be nestable', function(done) {
    lightning.tmpl('<b>{{block foo}}h{{block bar}}e{{/block}}y{{/block}}</b>', null, null, function(err, res){
      res.toString().should.eql('<b>hey</b>');
      res.blocks.bar.should.eql('e');
      res.blocks.foo.should.eql('hey');
      done();
    })
  });
  
});