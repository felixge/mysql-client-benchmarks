#include <mysql.h>
#include <stdio.h>
#include <sys/time.h>
#include <stdlib.h>

struct blog_post{
  char *id;
  char *title;
  char *text;
  char *created;
  char *updated;
};

int main(int argc, char *argv[]) {
   printf("libmysql: %s\n\n", mysql_get_client_info());

   MYSQL *conn;
   MYSQL_RES *res;
   MYSQL_ROW row;

   char *server = getenv("MYSQL_HOST");
   char *user = getenv("MYSQL_USER");
   char *password = getenv("MYSQL_PASSWORD");
   char *database = getenv("MYSQL_DATABASE");
   unsigned int port = atoi(getenv("MYSQL_PORT"));

   conn = mysql_init(NULL);

   if (!mysql_real_connect(conn, server,
         user, password, database, port, NULL, 0)) {
      fprintf(stderr, "%s\n", mysql_error(conn));
      exit(1);
   }

   while (1) {
     struct timeval start;
     gettimeofday(&start, NULL);

     if (mysql_query(conn, "SELECT * FROM blog_posts")) {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
     }

     res = mysql_use_result(conn);

     unsigned int fields = mysql_num_fields(res);
     while ((row = mysql_fetch_row(res)) != NULL) {
       unsigned long *lengths = mysql_fetch_lengths(res);

       struct blog_post post;

       // This is not entirely fair as all the other clients actually create
       // a dynamic hash table for each row (using the information provided by
       // the field packets). Unfortunately I'm not sure what the idiomatic C
       // code for that would look like.

       post.id = row[0];
       post.title = row[1];
       post.text = row[2];
       post.created = row[3];
       post.updated = row[4];
     }

     mysql_free_result(res);

     struct timeval end;
     gettimeofday(&end, NULL);

     double duration;

     duration = (end.tv_sec - start.tv_sec);
     duration += (end.tv_usec - start.tv_usec) / 1000000.0;

     int frequency = 100000 / duration;

     fprintf(stdout, "%d\n", frequency);
     fflush(stdout);
   }

   mysql_close(conn);
}
