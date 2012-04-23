var lightning = require('../lib/lightning');

describe('tag#html', function() {

  it('should not escape the variable given', function(done) {
    lightning.tmpl('<b>{{html a}}</b>', {a:'<a b="c&d" d=\'e\'>test</a>'}, {}, function(err, res){
      res.toString().should.eql('<b><a b="c&d" d=\'e\'>test</a></b>');
      done();
    })
  });
  
});