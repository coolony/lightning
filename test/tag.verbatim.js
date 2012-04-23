var lightning = require('../lib/lightning');

describe('tag#verbatim', function() {

  it('should not do anything with what\'s inside', function(done) {
    lightning.tmpl('<b>{{verbatim}}${a}{{/verbatim}}</b>', {a:'foo'}, {}, function(err, res){
      res.toString().should.eql('<b>${a}</b>');
      done();
    })
  });
  
});