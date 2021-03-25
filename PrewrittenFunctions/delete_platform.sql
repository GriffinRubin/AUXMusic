-- delete platform from any links to users (has_service table)

 DELETE FROM has_service
 WHERE platform_platform_id = 1;
 
 -- now delete from platform table
 
 DELETE FROM platform
 WHERE platform_id = 1;
 