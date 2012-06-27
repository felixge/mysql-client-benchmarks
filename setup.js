var fs         = require('fs');
var mysql      = require('mysql');
var loremIpsum = require('lorem-ipsum');
var connection = mysql.createConnection({
  host               : process.env.MYSQL_HOST,
  port               : process.env.MYSQL_PORT,
  user               : process.env.MYSQL_USER,
  password           : process.env.MYSQL_PASSWORD,
  database           : process.env.MYSQL_DATABASE,
  multipleStatements : true,
});

var sql = fs.readFileSync(__dirname + '/fixtures/blog_posts.sql', 'utf-8');
connection.query(sql, function(err) {
  if (err) throw err;

  createNextRow();
});


var remainingRows = 100 * 1000;
function createNextRow() {
  var row = {
    title   : loremIpsum({count : 5, units : 'words'}),
    text    : loremIpsum({count : 5, units : 'paragraphs'}),
    created : new Date,
    updated : new Date,
  };

  var sql = 'INSERT INTO blog_posts SET ?';
  connection.query(sql, row, function(err) {
    if (err) throw err;

    remainingRows--;
    if (remainingRows) {
      createNextRow();
    } else {
      connection.end();
    }
  });
}
