if (testSupport.isNode) {
  var Benchmark = require('benchmark');
}

suite('bench js', function() {

  var icsData;
  var bench;

  suiteSetup(function() {
    bench = new Benchmark.Suite();

    var value = '"\\\,\\\,foo \\\" bar"';
    var regex = /,?("[^"]+"|[^";:,]+)/g;

    function findNext(buffer, value, pos) {
      if (pos === undefined) {
        pos = 0;
      }
      while ((pos = buffer.indexOf(value, pos)) !== -1) {
        if (pos > 0 && buffer[pos - 1] === '\\') {
          pos += 1;
        } else {
          return pos;
        }
      }
    }

    var values = [1, 2, 3, 4];

    bench.add('inline array', function() {
      var arr = [];
      arr[0] = values[0];
      arr[1] = values[1];
      arr[2] = values[2];
      arr[3] = values[3];
    });

    bench.add('sparseArray:', function() {
      var arr = [];
      arr[2] = values[2];
      arr[0] = values[0];
      arr[1] = values[1];
      arr[3] = values[3];
    });

    bench.add('indexOf: find escaped value', function() {
      findNext(value, '"', 1);
    }, { maxTime: 1 });

    bench.add('regex: find escaped value', function() {
      value.match(regex);
    });
  });

  test('benchmark', function(done) {
    this.timeout((bench.maxTime * 2) * 1000);

    bench.on('cycle', function(event) {
      console.log(String(event.target), '<---?');
    });

    bench.on('complete', function(event) {
      done();
    });

    bench.run();
  });

});
