# MySQL client benchmark

This benchmark tries to compare the performance of different mysql clients. At
this point it only compares the performance of selecting 100k blog post rows.

Benchmarks of this nature are incredibly hard, so do not conclude anything from
this without deeply analyzing

## Setup

You need to set the following environment variables:

```
export MYSQL_HOST="localhost"
export MYSQL_PORT="3306"
export MYSQL_USER="your-user"
export MYSQL_PASSWORD="your-pass"
export MYSQL_DATABASE="some_db_that_exists"
```

After that run `node setup.js` which will create a table with 100k random blog
post records for you.

## Running the benchmarks

To run a benchmark, do:

```
./run.js benchmarks/node-mysql-2.0.0-alpha3.js
```

See the benchmarks folder for available benchmarks.
