var lightning = require('../lib/lightning');

describe('tag#html', function() {

  it('should not do anything', function(done) {
    lightning.tmpl('<b>{{! Some highly essential comment here}}</b>', null, null, function(err, res){
      res.toString().should.eql('<b></b>');
      done();
    })
  });
  
});