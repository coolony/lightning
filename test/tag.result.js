var lightning = require('../lib/lightning');

describe('tag#result', function() {

  it('should return value of the thing', function(done) {
    lightning.tmpl('<b>{{= typeof ""}}</b>', null, null, function(err, res){
      res.toString().should.eql('<b>string</b>');
      done();
    })
  });
  
  it('should support internal method calls', function(done) {
    lightning.tmpl('<b>{{= (typeof "").toUpperCase()}}</b>', null, null, function(err, res){
      res.toString().should.eql('<b>STRING</b>');
      done();
    })
  });
  
  it('should work with additional spaces', function(done) {
    lightning.tmpl('<b>{{= "foo" }}</b>', null, null, function(err, res){
      res.toString().should.eql('<b>foo</b>');
      done();
    })
  });
  
  it('should escape result by default', function(done) {
    lightning.tmpl('<b>{{= a}}</b>', {a:'<a b="c&d" d=\'e\'>test</a>'}, {}, function(err, res){
      res.toString().should.eql('<b>&lt;a b=&quot;c&amp;d&quot; d=&#39;e&#39;&gt;test&lt;/a&gt;</b>');
      done();
    })
  });
  
  it('should support filters', function(done) {
    lightning.tmpl('<b>{{= a|raw}}</b>', {a:'<a b="c&d" d=\'e\'>test</a>'}, {}, function(err, res){
      res.toString().should.eql('<b><a b="c&d" d=\'e\'>test</a></b>');
      done();
    })
  });
  
});