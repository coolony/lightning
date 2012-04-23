var lightning = require('../lib/lightning');

describe('filters.escape', function() {

  it('should escape things correctly', function() {
    lightning.filters.escape('<a b="c&d" d=\'e\'>test</a>').should.eql('&lt;a b=&quot;c&amp;d&quot; d=&#39;e&#39;&gt;test&lt;/a&gt;')
  });
  
});