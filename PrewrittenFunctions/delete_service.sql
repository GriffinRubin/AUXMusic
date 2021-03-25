-- delete service from user profile

DELETE FROM has_service 
WHERE users_user_id = 1
AND platform_platform_id = 1;