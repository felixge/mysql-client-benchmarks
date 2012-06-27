#!/usr/bin/env node

var script = process.cwd() + '/' + process.argv[2];
var spawn  = require('child_process').spawn;

var numbers       = [];
var boringResults = 0;
var scriptRuns    = 0;

function runScript() {
  scriptRuns++;

  var child = spawn(script, []);

  var buffer = '';
  child.stdout.on('data', function(chunk) {
    buffer += chunk;

    var offset;
    while ((offset = buffer.indexOf('\n')) > -1) {
      var line = buffer.substr(0, offset);
      var number = parseInt(line, 10);

      buffer = buffer.substr(offset + 1);

      if (isNaN(number)) {
        console.log(line);
        continue;
      }


      var maxBefore = max();
      var minBefore = min();

      numbers.push(number);

      if (maxBefore === max() && minBefore === min()) {
        boringResults++;
      }

      if (boringResults > 10) {
        boringResults = 0;
        child.kill();
        runScript();
      }
    }
  });
}

function report() {
  if (max() === undefined) return;

  console.log(
    'max: %s | median: %s | sdev: %s | last: %s | min: %s | runs: %s | results: %s',
    max(),
    median(),
    sdev(),
    numbers[numbers.length - 1],
    min(),
    scriptRuns,
    numbers.length
  );
}

function min() {
  if (!numbers.length) return undefined;

  return numbers.reduce(function(min, number) {
    return (number < min)
      ? number
      : min;
  });
}

function max() {
  if (!numbers.length) return undefined;

  return numbers.reduce(function(max, number) {
    return (number > max)
      ? number
      : max;
  });
}

function median() {
  return numbers[Math.floor(numbers.length / 2)];
}

function sdev() {
  if (!numbers.length) return undefined;

  return Math.round(Math.sqrt(variance()));
}

function variance() {
  var t = 0, squares = 0, len = numbers.length;

  for (var i=0; i<len; i++) {
    var obs = numbers[i];
    t += obs;
    squares += Math.pow(obs, 2);
  }
  return (squares/len) - Math.pow(t/len, 2);
}

setInterval(report, 1000);

runScript();

var timeoutSeconds = 60;
setTimeout(function() {
  console.log('Stopping benchmark, %d sec have passed.', timeoutSeconds);
  process.exit(0);
}, timeoutSeconds * 1000);
