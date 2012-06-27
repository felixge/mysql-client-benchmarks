#!/usr/bin/env node
var path    = process.argv[2] || 'mysql-libmysqlclient';
var package = require(path + '/package.json');
var mysql   = require(path);

console.log('node: %s', process.version);
console.log('node-%s: %s', package.name, package.version);
console.log('');

var connection = mysql.createConnectionSync();
connection.connectSync(
  process.env.MYSQL_HOST,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  process.env.MYSQL_DATABASE,
  null,
  '/var/mysql/mysql.sock'
);

next();

function next() {
  var sql = 'SELECT * FROM blog_posts';
  var start = Date.now();

  var res = connection.querySync(sql);
  res.fetchAll(function (err, rows) {
    if (err) throw err;

    var duration = (Date.now() - start) / 1000;
    console.log(parseInt(rows.length / duration, 10));

    next();
  });
}
