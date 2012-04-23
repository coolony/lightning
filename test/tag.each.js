var lightning = require('../lib/lightning');

describe('tag#each', function() {

  it('should work with common syntax', function(done) {
    lightning.tmpl('{{each(i, name) names}}<p>${i}.${name}</p>{{/each}}', {names: ["A", "B"]}, null, function(err, res){
      res.toString().should.eql('<p>A.0</p><p>B.1</p>');
      done();
    })
  });
  
});