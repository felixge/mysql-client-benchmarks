#!/usr/bin/env php
<?php
echo "php: " . phpversion() . "\n";
echo "mysqlnd: " . phpversion('mysqlnd') . "\n";
echo "\n";

ini_set('memory_limit', '512M');

$connection = new mysqli(
  $_ENV['MYSQL_HOST'],
  $_ENV['MYSQL_USER'],
  $_ENV['MYSQL_PASSWORD'],
  $_ENV['MYSQL_DATABASE'],
  $_ENV['MYSQL_PORT'],
  '/var/mysql/mysql.sock'
);

if ($mysqli->connect_error) {
  die('Connect Error (' . $connection->connect_errno . ') ' . $connection->connect_error);
}

while (true) {
  $start = microtime(true);

  $result = $connection->query('SELECT * FROM blog_posts');
  $rows = $result->fetch_all(MYSQLI_ASSOC);

  $duration = microtime(true) - $start;
  $rowsPerSec = (int)(count($rows) / $duration);
  echo $rowsPerSec . "\n";

  $result->close();
}
