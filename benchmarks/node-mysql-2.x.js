#!/usr/bin/env node
var path    = process.argv[2] || 'mysql';
var package = require(path + '/package.json');
var mysql   = require(path);

console.log('node: %s', process.version);
console.log('node-%s: %s', package.name, package.version);
console.log('');

var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  port     : process.env.MYSQL_PORT,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
});

connection.connect(function(err) {
  if (err) throw err;

  next();
});

function next() {
  var sql = 'SELECT * FROM blog_posts';

  var start = Date.now();
  connection.query(sql, function(err, rows) {
    if (err) throw err;

    var duration = (Date.now() - start) / 1000;
    console.log(rows.length / duration);

    next();
  });
}
